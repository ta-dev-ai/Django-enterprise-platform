"""CLI entry for MCP tools."""

from __future__ import annotations

import argparse
import json
import sys

from data.mcp.tools import analyze_dataset, ask_data_tool, export_report, get_knowledge


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Data Intelligence MCP CLI")
    sub = parser.add_subparsers(dest="command", required=True)

    p_analyze = sub.add_parser("analyze_dataset")
    p_analyze.add_argument("path")
    p_analyze.add_argument("--domain-hint", default=None)

    p_knowledge = sub.add_parser("get_knowledge")
    p_knowledge.add_argument("dataset_id")

    p_ask = sub.add_parser("ask_data")
    p_ask.add_argument("dataset_id")
    p_ask.add_argument("question")

    p_export = sub.add_parser("export_report")
    p_export.add_argument("dataset_id")
    p_export.add_argument("--format", default="html")

    args = parser.parse_args(argv)
    if args.command == "analyze_dataset":
        result = analyze_dataset(args.path, domain_hint=args.domain_hint)
    elif args.command == "get_knowledge":
        result = get_knowledge(args.dataset_id)
    elif args.command == "ask_data":
        result = ask_data_tool(args.dataset_id, args.question)
    elif args.command == "export_report":
        result = export_report(args.dataset_id, fmt=args.format)
    else:
        return 1
    print(json.dumps(result, ensure_ascii=False, indent=2, default=str))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
