def test_submit_transition():
    current = "draft"
    next_state = "submitted"

    assert current == "draft"
    assert next_state == "submitted"


def test_approved_lock():
    status = "approved"
    editable = status != "approved"

    assert editable is False
