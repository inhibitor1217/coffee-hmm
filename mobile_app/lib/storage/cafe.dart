import 'dart:async';
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

final Future<SharedPreferences> _prefs = SharedPreferences.getInstance();

mixin SavedCafe {
  final String _key = 'savedCafes';
  final String currentVersion = '1';

  Future<List<dynamic>> getSavedCafes(String version) async {
    final SharedPreferences prefs = await _prefs;
    final String? _data = prefs.getString(_key);

    if(_data == null) return [];

    final List<dynamic> _targetData = jsonDecode(_data)[version];
    if(version == '1'){
      final _cafeIds = _targetData.cast<String>();
      return _cafeIds;
    }
    return [];
  }

  void saveCafe(String version, dynamic newCafe) async {
    final List<dynamic> _targetData = await getSavedCafes(version);

    final _updateCafes = () {
      if(version == '1' && newCafe.runtimeType == String)
      {
        final _cafeIds = _targetData.cast<String>();
        return _cafeIds..add(newCafe as String);
      }


      return [];
    };

    _updatedData(version, _updateCafes());
  }

  void removeCafe(String version, String cafeId) async {
    final List<dynamic> _targetData = await getSavedCafes(version);

    final _updateCafes = () {
      if(version == '1'){
        final _cafeIds = _targetData.cast<String>();
        _cafeIds.removeWhere((id) => id == cafeId);
        return _cafeIds;
      }

      return [];
    };

    _updatedData(version, _updateCafes());
  }

  Future<void> resetSavedCafes() async {
    final SharedPreferences prefs = await _prefs;

    await prefs.remove(_key);
  }

  void _updatedData(String version, List<dynamic> newCafes) async {
    final SharedPreferences prefs = await _prefs;
    String? _data = prefs.getString(_key);

    Map<String, List<dynamic>> _newData = {};
    if(_data != null){
      _newData = {
        ...jsonDecode(_data),
        version: newCafes,
      };
    }else {
      _newData = {
        version: newCafes,
      };
    }
    
    await prefs.setString(_key, jsonEncode(_newData));
  }
}