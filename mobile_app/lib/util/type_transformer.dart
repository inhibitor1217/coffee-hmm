extension EnumTransform on String {
  String enumToString<T>(List<T> list, T value){
    if(value == null || (list.isEmpty)) return '';

    final T? target = list.firstWhere((_enum) => _enum.toString() == value.toString());

    if(target == null) return '';

    return target.toString().split('.').last;
  }

  T stringToEnum<T>(List<T> list, T defaultValue){
    return list.firstWhere((_enum) => _enum.toString().split('.').last == this,
        orElse: () => defaultValue);
  }
}