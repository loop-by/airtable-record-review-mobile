package com.example.recordreview;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/** Public, read-only Airtable page with a local layout enhancement. No JS bridge. */
public final class MainActivity extends Activity {
    private String sharedPath;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private WebView webView;
    private TextView status;
    private String patch;
    private int generation = 0;

    @Override public void onCreate(Bundle savedState) {
        super.onCreate(savedState);
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setBackgroundColor(Color.WHITE);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
                    insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        status = new TextView(this);
        status.setText("공개 Interface를 불러오는 중…");
        status.setTextColor(Color.rgb(35, 80, 55));
        status.setPadding(16, 10, 16, 10);
        root.addView(status);
        webView = new WebView(this);
        root.addView(webView, new LinearLayout.LayoutParams(-1, 0, 1));
        setContentView(root);
        root.requestApplyInsets();

        Uri page = getIntent().getData();
        if (page == null || !"https".equals(page.getScheme())
                || !"airtable.com".equals(page.getAuthority()) || page.getPath() == null
                || !page.getPath().matches("/app[A-Za-z0-9]{14}/shr[A-Za-z0-9]{14}/?")) {
            status.setText("공개 Record review 링크로 앱을 열어주세요.");
            return;
        }
        sharedPath = page.getPath();

        try (InputStream input = getAssets().open("mobile-fix.js");
             ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192];
            int count;
            while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
            patch = new String(output.toByteArray(), StandardCharsets.UTF_8);
        } catch (Exception error) {
            status.setText("화면 보정 파일을 읽지 못했습니다.");
            return;
        }

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        settings.setSupportZoom(true);
        settings.setBuiltInZoomControls(true);
        settings.setDisplayZoomControls(false);
        // Ask for the desktop Interface while retaining the actual mobile viewport.
        settings.setUserAgentString("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36");
        webView.setWebViewClient(new WebViewClient() {
            @Override public void onPageStarted(WebView view, String url, android.graphics.Bitmap icon) {
                generation++;
                status.setVisibility(View.VISIBLE);
                status.setText("공개 Interface를 불러오는 중…");
            }
            @Override public void onPageFinished(WebView view, String url) {
                if (isSharedPage(Uri.parse(url))) applyWhenReady(generation, 0);
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (!request.isForMainFrame()) return false;
                Uri target = request.getUrl();
                if (isSharedPage(target)) return false;
                if (request.hasGesture() && "https".equals(target.getScheme())) {
                    try { startActivity(new Intent(Intent.ACTION_VIEW, target)); }
                    catch (android.content.ActivityNotFoundException ignored) {
                        status.setVisibility(View.VISIBLE);
                        status.setText("링크를 열 수 있는 브라우저가 없습니다.");
                    }
                }
                return true;
            }
        });
        webView.loadUrl(page.toString());
    }

    private boolean isSharedPage(Uri uri) {
        return "https".equals(uri.getScheme()) && "airtable.com".equals(uri.getHost())
                && sharedPath != null && sharedPath.equals(uri.getPath());
    }

    private void applyWhenReady(int expected, int attempt) {
        if (expected != generation || isFinishing() || isDestroyed()) return;
        if (!isSharedPage(Uri.parse(webView.getUrl() == null ? "" : webView.getUrl()))) return;
        String probe = "!!document.querySelector('[data-tutorial-selector-id=\"inboxPageElementRendererSidebar\"]')" +
                "&&!!document.querySelector('[data-testid=\"page-element:recordContainerGrid\"]')";
        webView.evaluateJavascript(probe, ready -> {
            if (expected != generation || isFinishing() || isDestroyed()) return;
            if ("true".equals(ready)) {
                webView.evaluateJavascript(patch, ignored -> {
                    webView.evaluateJavascript("!!document.getElementById('rr-mobile-review-bar')", applied -> {
                        status.setVisibility("true".equals(applied) ? View.GONE : View.VISIBLE);
                        if (!"true".equals(applied)) status.setText("화면 보정을 적용하지 못했습니다.");
                    });
                });
            } else if (attempt < 60) {
                handler.postDelayed(() -> applyWhenReady(expected, attempt + 1), 500);
            } else {
                status.setText("원본이 늦게 로딩되거나 화면 구조가 바뀌었습니다. 앱을 다시 열어주세요.");
            }
        });
    }

    @Override public void onBackPressed() {
        if (webView != null && webView.canGoBack()) webView.goBack();
        else super.onBackPressed();
    }
    @Override public void onDestroy() {
        generation++;
        handler.removeCallbacksAndMessages(null);
        if (webView != null) webView.destroy();
        super.onDestroy();
    }
}
