import 'dart:async';
import 'dart:convert';
import 'package:mobile_app/constants/type.dart';
import 'package:shared_preferences/shared_preferences.dart';

final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

mixin SavedCafe {
  final String _key = 'savedCafes';

  Future<List<CafeModel>> getSavedCafes() async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _cafesStr = prefs.getStringList(_key) ?? [];
    final List<CafeModel> _cafes = _cafesStr.map((cafe) => CafeModel.fromJson(jsonDecode(cafe)))
        .fold(<CafeModel>[], (prev, element) => prev..add(element));

    return _cafes;
  }

  Future<List<String>> getSavedCafeIds() async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _cafesStr = prefs.getStringList(_key) ?? [];
    final List<String> _cafeIds = _cafesStr.map((cafe) => jsonDecode(cafe)['id'])
        .fold(<String>[], (prev, element) => prev..add(element));

    return _cafeIds;
  }

  Future<void> saveCafe(CafeModel cafe) async {
    final SharedPreferences prefs = await _prefs;
    List<String> _cafesStr = prefs.getStringList(_key) ?? [];

    await prefs.setStringList(_key, _cafesStr..add(jsonEncode(CafeModel.toJson(cafe))));
  }

  Future<void> removeCafe(String cafeId) async {
    final SharedPreferences prefs = await _prefs;
    final List<String> _cafesStr = prefs.getStringList(_key) ?? [];

    _cafesStr.removeWhere((cafe) => jsonDecode(cafe)['id'] == cafeId);

    await prefs.setStringList(_key, _cafesStr);
  }

  Future<void> resetSavedCafes() async {
    final SharedPreferences prefs = await _prefs;

    await prefs.remove(_key);
  }
}