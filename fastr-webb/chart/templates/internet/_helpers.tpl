{{/****************************************************************
   *  FAST AUTH                                                   *
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
{{- define "fastr.internet.name" -}}
{{- if .Values.fastr.internet.fullnameOverride -}}
{{- .Values.fastr.internet.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- printf "%s-%s" $name .Values.fastr.internet.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "fastr.internet.labels" -}}
{{ include "fastr.internet.matchLabels" . }}
{{ include "fastr.common.metaLabels" . }}
{{- end -}}

{{- define "fastr.internet.matchLabels" -}}
app: {{ template "fastr.internet.name" . }}
release: {{ .Release.Name }}
{{- end -}}

{{- define "fastr.internet.port" -}}
{{- printf "%d" (int64 .Values.fastr.internet.service.port) -}}
{{- end -}}

{{- define "fastr.internet.path" -}}
{{- printf "%s" .Values.fastr.internet.path -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "fastr.internet.fullname" -}}
{{- if .Values.fastr.internet.fullnameOverride -}}
{{- .Values.fastr.internet.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- printf "%s-%s" .Release.Name .Values.fastr.internet.name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s-%s" .Release.Name $name .Values.fastr.internet.name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "fastr.internet.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create the name of the service account to use for the server component
*/}}
{{- define "fastr.internet.server" -}}
{{- if .Values.serviceAccounts.server.create -}}
    {{ default (include "fastr.internet.fullname" .) .Values.serviceAccounts.server.name }}
{{- else -}}
    {{ default "default" .Values.serviceAccounts.server.name }}
{{- end -}}
{{- end -}}