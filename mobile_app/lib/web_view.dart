import 'dart:async';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:mobile_app/header.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewPage extends StatefulWidget {
  final String uri;

  WebViewPage({required this.uri});

  @override
  WebViewPageState createState() => WebViewPageState(uri: uri);
}

class WebViewPageState extends State<WebViewPage> {
  final String uri;

  WebViewPageState({required this.uri});

  late WebViewController controller;

  final Completer<WebViewController> _completerController =
      Completer<WebViewController>();

  @override
  void initState() {
    super.initState();
    if (Platform.isAndroid) WebView.platform = SurfaceAndroidWebView();
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        child: Scaffold(
          appBar: BaseHeader(),
          body: SafeArea(
            child: WebView(
              initialUrl: uri,
              javascriptMode: JavascriptMode.unrestricted,
              onWebViewCreated: (WebViewController c) {
                _completerController.future.then((value) => controller = value);
                _completerController.complete(c);
              },
            ),
          ),
        ),
        onWillPop: () => _goBack(context));
  }

  Future<bool> _goBack(BuildContext context) async {
    if (await controller.canGoBack()) {
      controller.goBack();
      return Future.value(false);
    } else {
      return Future.value(true);
    }
  }
}
