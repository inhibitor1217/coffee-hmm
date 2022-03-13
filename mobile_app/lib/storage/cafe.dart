import 'dart:async';
import 'package:shared_preferences/shared_preferences.dart';

final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

mixin SavedCafe {
  final String _key = 'savedCafeIds';

  Future<List<String>> getSavedCafes() async {
    final SharedPreferences prefs = await _prefs;

    return prefs.getStringList(_key) ?? [];
  }

  Future<void> saveCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    List<String> _cafes = prefs.getStringList(_key) ?? [];

    await prefs.setStringList(_key, _cafes..add(cafeId));
  }

  Future<void> removeCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _cafes = prefs.getStringList(_key) ?? [];

    _cafes.removeWhere((id) => id == cafeId);

    await prefs.setStringList(_key, _cafes);
  }

  Future<void> resetSavedCafes() async {
    final SharedPreferences prefs = await _prefs;

    await prefs.remove(_key);
  }
}