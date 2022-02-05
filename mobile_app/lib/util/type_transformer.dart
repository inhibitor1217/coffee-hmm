extension EnumTransform on String {
  T stringToEnum<T>(List<T> list, T defaultValue){
    return list.firstWhere((_enum) => _enum.toString().split('.').last == this,
        orElse: () => defaultValue);
  }
}