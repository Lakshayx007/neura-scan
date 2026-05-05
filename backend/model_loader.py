from __future__ import annotations

from functools import lru_cache
from pathlib import Path
from typing import Any

import numpy as np
import tensorflow as tf
from PIL import Image
from tensorflow import keras

try:
    from huggingface_hub import snapshot_download
except ImportError:  # pragma: no cover - handled by fallback model path
    snapshot_download = None


MODEL_REPO_ID = "Devarshi/brain_tumor_mri_efficientnet"
MODEL_WEIGHTS_PATH = Path(__file__).with_name("model_weights.h5")
IMAGE_SIZE = (300, 300)
CLASS_LABELS = ("glioma", "meningioma", "pituitary_tumor", "no_tumor")


def preprocess_image(image: Image.Image) -> np.ndarray:
    """Resize to 300x300 RGB and normalize pixel values to [0, 1]."""
    image = image.convert("RGB").resize(IMAGE_SIZE)
    image_array = np.asarray(image, dtype=np.float32) / 255.0
    return np.expand_dims(image_array, axis=0)


def predict_image(image: Image.Image) -> dict[str, Any]:
    model = load_model()
    batch = preprocess_image(image)
    raw_prediction = model.predict(batch, verbose=0)[0]
    scores = _normalize_scores(raw_prediction)
    best_index = int(np.argmax(scores))

    return {
        "prediction": CLASS_LABELS[best_index],
        "confidence": float(scores[best_index]),
        "all_scores": {
            label: float(score) for label, score in zip(CLASS_LABELS, scores, strict=True)
        },
    }


@lru_cache(maxsize=1)
def load_model() -> keras.Model:
    huggingface_model = _load_huggingface_model()
    if huggingface_model is not None:
        return huggingface_model

    model = _build_efficientnet_b3_classifier()
    if MODEL_WEIGHTS_PATH.exists():
        model.load_weights(MODEL_WEIGHTS_PATH)
    return model


def _load_huggingface_model() -> keras.Model | None:
    if snapshot_download is None:
        return None

    try:
        model_dir = Path(snapshot_download(repo_id=MODEL_REPO_ID))
    except Exception:
        return None

    keras_artifact = _find_first_model_artifact(model_dir, ("*.keras", "*.h5", "*.hdf5"))
    if keras_artifact is not None:
        try:
            return keras.models.load_model(keras_artifact, compile=False)
        except Exception:
            model = _build_efficientnet_b3_classifier()
            try:
                model.load_weights(keras_artifact)
                return model
            except Exception:
                return None

    return None


def _find_first_model_artifact(base_dir: Path, patterns: tuple[str, ...]) -> Path | None:
    for pattern in patterns:
        matches = sorted(base_dir.rglob(pattern))
        if matches:
            return matches[0]
    return None


def _build_efficientnet_b3_classifier() -> keras.Model:
    inputs = keras.Input(shape=(300, 300, 3))
    base_model = keras.applications.EfficientNetB3(
        include_top=False,
        weights=None,
        input_tensor=inputs,
        pooling="avg",
    )
    outputs = keras.layers.Dense(len(CLASS_LABELS), activation="softmax")(base_model.output)
    return keras.Model(inputs=inputs, outputs=outputs, name="neurascan_efficientnet_b3")


def _normalize_scores(prediction: np.ndarray) -> np.ndarray:
    scores = np.asarray(prediction, dtype=np.float32).reshape(-1)
    if scores.shape[0] != len(CLASS_LABELS):
        raise ValueError(
            f"Model returned {scores.shape[0]} scores, expected {len(CLASS_LABELS)}."
        )

    if np.any(scores < 0) or not np.isclose(float(np.sum(scores)), 1.0, atol=1e-3):
        scores = tf.nn.softmax(scores).numpy()

    return scores
