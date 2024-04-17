# Copyright 2024 Marimo. All rights reserved.
from __future__ import annotations

from typing import Any

from marimo._runtime.requests import SerializedCLIArgs


def parse_args(
    args: tuple[str],
) -> SerializedCLIArgs:
    """
    Parse command line arguments into a dictionary.

    This does not support lists as values.
    """

    args_dict: SerializedCLIArgs = {}

    # Combine any arguments that are split by spaces
    new_args: list[str] = []
    for arg in args:
        if arg.startswith(("-", "--")):
            new_args.append(arg)
        else:
            new_args[-1] += f" {arg}"

    for arg in new_args:
        if arg.startswith(("-", "--")):
            # Strip leading dashes
            arg = arg.lstrip("-")
            key: str
            value: Any

            if "=" in arg:
                key, value = arg.split("=", 1)
            elif " " in arg:
                key, value = arg.split(" ", 1)
                key = key.strip()
                value = value.strip()
            else:
                key = arg
                value = ""

            # Try numeric conversion
            try:
                value = int(value)
            except ValueError:
                try:
                    value = float(value)
                except ValueError:
                    pass

            # Try boolean conversion
            if value == "True":
                value = True
            elif value == "true":
                value = True
            elif value == "false":
                value = False
            elif value == "False":
                value = False

            # Create a list for duplicate arguments
            if key in args_dict:
                current = args_dict[key]
                if isinstance(current, list):
                    current.append(value)
                else:
                    args_dict[key] = [current, value]
            else:
                args_dict[key] = value

    return args_dict