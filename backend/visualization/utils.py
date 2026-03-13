import re


def build_solver_group_name(session_id):
    safe_session_id = re.sub(r"[^a-zA-Z0-9.-]", "-", session_id)
    return f"solver.{safe_session_id}"[:100]
