{{/****************************************************************
   *  FAST ACTS                                                   *
   ****************************************************************
   * Set all the helper functions for the defined service         *
   *                                                              *
   * Change all "fastr.xxxx" by replacing xxxx by the name of the *
   * service                                                      *
   ****************************************************************
   */}} 

{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "fastr.extranet.name" -}}
{{- if .Values.fastr.extranet.fullnameOverride -}}
{{- .Values.fastr.extranet.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" $name .Values.fastr.extranet.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "fastr.extranet.labels" -}}
{{ include "fastr.extranet.matchLabels" . }}
{{ include "fastr.common.metaLabels" . }}
{{- end -}}

{{- define "fastr.extranet.matchLabels" -}}
app: {{ template "fastr.extranet.name" . }}
release: {{ .Release.Name }}
{{- end -}}

{{- define "fastr.extranet.port" -}}
{{- printf "%d" (int64 .Values.fastr.extranet.service.port) -}}
{{- end -}}

{{- define "fastr.extranet.path" -}}
{{- printf "%s" .Values.fastr.extranet.path -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "fastr.extranet.fullname" -}}
{{- if .Values.fastr.extranet.fullnameOverride -}}
{{- .Values.fastr.extranet.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- printf "%s-%s" .Release.Name .Values.fastr.extranet.name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s-%s" .Release.Name $name .Values.fastr.extranet.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "fastr.extranet.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create the name of the service account to use for the server component
*/}}
{{- define "fastr.extranet.server" -}}
{{- if .Values.serviceAccounts.server.create -}}
    {{ default (include "fastr.extranet.fullname" .) .Values.serviceAccounts.server.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccounts.server.name }}
{{- end -}}
{{- end -}}