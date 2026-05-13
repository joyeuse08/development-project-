import pytest

def test_valid_score():
    score = 80
    assert score <= 100


def test_invalid_score():
    score = 120
    assert score > 100


def test_negative_score():
    score = -5
    assert score < 0
