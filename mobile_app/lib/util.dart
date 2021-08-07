void handleLinkShareClick() {
  print('share click!');
}

void handleNaverClick() {
  print('naver click!');
}

void handleInstagramClick() {
  print('instagram click!');
}

class ListUtils {
  static Iterable<T> join<T>(Iterable<T> iterable, {required T separator}) =>
      iterable.fold(Iterable<T>.empty(),
          (p, v) => p.isEmpty ? [...p, v] : [...p, separator, v]);
}
