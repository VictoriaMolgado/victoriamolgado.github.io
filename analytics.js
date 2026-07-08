!(function (t, e) {
  var o, n, p, r;
  e.__SV ||
    ((window.posthog = e),
    (e._i = []),
    (e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        2 == o.length && ((t = t[o[0]]), (e = o[1])),
          (t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          });
      }
      (((p = t.createElement("script")).type = "text/javascript"),
        (p.crossOrigin = "anonymous"),
        (p.async = !0),
        (p.src =
          s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
          "/static/array.js"),
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(
          p,
          r,
        ));
      var u = e;
      for (
        void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
          u.people = u.people || [],
          u.toString = function (t) {
            var e = "posthog";
            return (
              "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e
            );
          },
          u.people.toString = function () {
            return u.toString(1) + ".people (stub)";
          },
          o =
            "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
              " ",
            ),
          n = 0;
        n < o.length;
        n++
      )
        g(u, o[n]);
      e._i.push([i, s, a]);
    }),
    (e.__SV = 1));
})(document, window.posthog || []);

posthog.init("phc_oeyDKikjtHSgDQKLqKebERv4SeaznHAQh7W7jYoYKPhF", {
  api_host: "https://us.i.posthog.com",
  defaults: "2026-05-30",
});

document.addEventListener("DOMContentLoaded", function () {
  // project_card_clicked — home page project cards
  document.querySelectorAll("a.project").forEach(function (card) {
    card.addEventListener("click", function () {
      var titleEl = card.querySelector(".project-title");
      posthog.capture("project_card_clicked", {
        project_name: titleEl ? titleEl.textContent.trim() : "unknown",
        project_href: card.getAttribute("href"),
      });
    });
  });

  // linkedin_clicked — footer and about page LinkedIn links
  document.querySelectorAll('a[href*="linkedin"]').forEach(function (link) {
    link.addEventListener("click", function () {
      posthog.capture("linkedin_clicked", {
        page: window.location.pathname,
      });
    });
  });

  // carousel_slide_changed — System Initiative hero carousel
  document.querySelectorAll(".hero-carousel-dot").forEach(function (dot, idx) {
    dot.addEventListener("click", function () {
      posthog.capture("carousel_slide_changed", {
        slide_index: idx,
      });
    });
  });
});
