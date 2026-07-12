"""API views for Data Intelligence V2."""

from __future__ import annotations

import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from data.dataset_store import (
    create_dataset_id,
    is_builtin,
    load_manifest,
    resolve_dataset_id,
    save_upload,
    source_path,
)
from data.services.acquisition.analyze_service import get_or_build_manifest
from data.services.acquisition.dataset_loader import load_dataframe
from data.services.intelligence.chat_analyst import ask_data
from data.services.intelligence.dialogue_gate import build_dialogue_state
from data.services.runtime.chart_engine import build_chart_data
from data.services.runtime.filter_engine import filter_preview
from data.services.runtime.sidebar_generator import generate_sidebar


def _json_body(request) -> dict:
    if not request.body:
        return {}
    return json.loads(request.body.decode("utf-8"))


def _load_df_for_dataset(dataset_id: str):
    path = source_path(dataset_id)
    if path is None:
        return None
    return load_dataframe(path)


@csrf_exempt
@require_http_methods(["POST"])
def api_dataset_upload(request):
    if "file" not in request.FILES:
        return JsonResponse({"error": "file required"}, status=400)
    dataset_id = create_dataset_id()
    uploaded = request.FILES["file"]
    save_upload(dataset_id, uploaded)
    return JsonResponse({"dataset_id": dataset_id, "filename": uploaded.name})


@csrf_exempt
@require_http_methods(["POST"])
def api_dataset_analyze(request, dataset_id):
    try:
        body = _json_body(request)
        force = body.get("force", False)
        domain_hint = body.get("domain_hint")
        manifest = get_or_build_manifest(
            dataset_id, force=force, domain_hint=domain_hint
        )
        return JsonResponse(
            {
                "manifest": manifest,
                "slices_count": len(manifest.get("engines_trace", [])),
            }
        )
    except FileNotFoundError as exc:
        return JsonResponse({"error": str(exc)}, status=404)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@require_http_methods(["GET"])
def api_dataset_knowledge(request, dataset_id):
    manifest = load_manifest(dataset_id)
    if manifest is None:
        try:
            manifest = get_or_build_manifest(dataset_id)
        except FileNotFoundError as exc:
            return JsonResponse({"error": str(exc)}, status=404)
    return JsonResponse(
        {
            "manifest": manifest,
            "slices_count": len(manifest.get("engines_trace", [])),
            "dataset_id": resolve_dataset_id(dataset_id),
        }
    )


@require_http_methods(["GET"])
def api_dataset_sidebar(request, dataset_id):
    manifest = load_manifest(dataset_id)
    if manifest is None:
        try:
            manifest = get_or_build_manifest(dataset_id)
        except FileNotFoundError as exc:
            return JsonResponse({"error": str(exc)}, status=404)
    return JsonResponse(generate_sidebar(manifest))


@csrf_exempt
@require_http_methods(["POST"])
def api_dataset_filter(request, dataset_id):
    try:
        body = _json_body(request)
        df = _load_df_for_dataset(dataset_id)
        if df is None:
            return JsonResponse({"error": "dataset source not found"}, status=404)
        result = filter_preview(df, body.get("filters", {}))
        return JsonResponse(result)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def api_dataset_chart(request, dataset_id):
    try:
        body = _json_body(request)
        manifest = load_manifest(dataset_id) or get_or_build_manifest(dataset_id)
        df = _load_df_for_dataset(dataset_id)
        if df is None:
            return JsonResponse({"error": "dataset source not found"}, status=404)
        result = build_chart_data(df, manifest, body.get("chart_spec"))
        return JsonResponse(result)
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def api_dataset_chat(request, dataset_id):
    try:
        body = _json_body(request)
        message = body.get("message", "").strip()
        if not message:
            return JsonResponse({"error": "message required"}, status=400)
        manifest = load_manifest(dataset_id) or get_or_build_manifest(dataset_id)
        result = ask_data(manifest, message)
        dialogue = build_dialogue_state(manifest)
        return JsonResponse({**result, "dialogue": dialogue})
    except Exception as exc:
        return JsonResponse({"error": str(exc)}, status=500)
