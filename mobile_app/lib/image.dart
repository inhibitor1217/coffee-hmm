String parseRelativeUri(String uri, String group) {
  if (uri.contains(group)) {
    final result = uri.split(group);
    return result.last;
  }
  return uri;
}
