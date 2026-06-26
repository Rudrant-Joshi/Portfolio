/* ========================================================
   LEFT SCROLL TIMELINE COMPONENT
   ======================================================== */
(function() {
  "use strict";

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var timelineFill = document.getElementById('timelineFill');
  var timelineOrb = document.getElementById('timelineOrb');
  var scrollTimeline = document.getElementById('scrollTimeline');
  var sections = ['about','stack','work','contact'];

  var timelineMarkers = {};
  if (scrollTimeline && !reduced) {
    sections.forEach(function(id, i){
      var marker = document.createElement('div');
      marker.className = 'timeline-marker';
      var label = document.createElement('span');
      label.className = 'timeline-marker-label';
      label.textContent = id.charAt(0).toUpperCase() + id.slice(1);
      marker.appendChild(label);
      scrollTimeline.appendChild(marker);
      timelineMarkers[id] = marker;

      // Click event to navigate smoothly using cached tops
      marker.addEventListener('click', function(e){
        var targetEl = document.getElementById(id);
        if (!targetEl) return;
        e.preventDefault();
        var top = (sectionTops[id] !== undefined ? sectionTops[id] : (targetEl.getBoundingClientRect().top + window.scrollY)) - (id === 'hero' ? 0 : 70);
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  var currentScrollPercent = 0;
  var targetScrollPercent = 0;
  var reachedStates = {};
  var sectionTops = {};

  // Module-level dimensions cache
  var cachedScrollHeight = 0;
  var cachedInnerHeight = 0;
  var cachedDocHeight = 0;

  // PERFORMANCE OPTIMIZATION: Pre-calculate tops relative to the document
  // and pre-position markers to prevent layout thrashing inside timelineLoop
  function initSectionTops() {
    cachedScrollHeight = document.documentElement.scrollHeight;
    cachedInnerHeight = window.innerHeight;
    cachedDocHeight = cachedScrollHeight - cachedInnerHeight;

    sections.forEach(function(id){
      var sectionEl = document.getElementById(id);
      if (!sectionEl) return;
      var rect = sectionEl.getBoundingClientRect();
      sectionTops[id] = rect.top + window.scrollY;
    });

    // Position markers statically based on the scroll percentage where the section is centered
    sections.forEach(function(id){
      if (!timelineMarkers[id]) return;

      var sectionTop = sectionTops[id] || 0;
      
      // Calculate targetScroll: scroll position where the section top reaches the center of the viewport
      // Clamped between 0 and cachedDocHeight
      var markerScroll = Math.max(0, Math.min(cachedDocHeight, sectionTop - cachedInnerHeight * 0.5));
      timelineMarkers[id].dataset.targetScroll = markerScroll;

      // Position marker top statically
      var markerTopRatio = cachedDocHeight > 0 ? (markerScroll / cachedDocHeight) : 0;
      var markerTop = markerTopRatio * cachedInnerHeight;
      timelineMarkers[id].style.top = Math.min(Math.max(markerTop, 20), cachedInnerHeight - 20) + 'px';
    });
  }

  function updateTimeline() {
    if (!timelineFill || !timelineOrb || reduced) return;

    var scrollTop = window.scrollY;
    targetScrollPercent = cachedDocHeight > 0 ? (scrollTop / cachedDocHeight) * 100 : 0;
  }

  function timelineLoop() {
    if (reduced) return;

    // Smooth linear interpolation (lerp)
    var diff = targetScrollPercent - currentScrollPercent;
    
    // Only update styles if there is a difference to prevent browser paint overload
    if (Math.abs(diff) > 0.01) {
      currentScrollPercent += diff * 0.15;
      timelineFill.style.height = currentScrollPercent + '%';
      var orbTop = (currentScrollPercent / 100) * cachedInnerHeight;
      timelineOrb.style.top = orbTop + 'px';
    } else if (currentScrollPercent !== targetScrollPercent) {
      currentScrollPercent = targetScrollPercent;
      timelineFill.style.height = currentScrollPercent + '%';
      var orbTop = (currentScrollPercent / 100) * cachedInnerHeight;
      timelineOrb.style.top = orbTop + 'px';
    }

    var scrollTop = window.scrollY;

    // Trigger scroll animations immediately when close to the bottom of the page
    if (cachedDocHeight - scrollTop < 80) {
      document.querySelectorAll('[data-scroll]').forEach(function(el){
        el.classList.add('is-visible');
      });
    }

    // Update marker states dynamically using pre-cached scroll target boundaries
    sections.forEach(function(id){
      if (!timelineMarkers[id]) return;

      var targetScroll = parseFloat(timelineMarkers[id].dataset.targetScroll) || 0;
      
      // Marker is reached and label is shown when the scroll position meets the marker's target alignment scroll point
      var isReached = (scrollTop >= targetScroll);
      var wasReached = reachedStates[id];

      // Detect hit when crossing boundary
      if (wasReached !== undefined && isReached !== wasReached) {
        timelineMarkers[id].classList.add('vibrate');
        timelineOrb.classList.add('vibrate');

        setTimeout(function(markerEl, orbEl){
          return function(){
            markerEl.classList.remove('vibrate');
            orbEl.classList.remove('vibrate');
          };
        }(timelineMarkers[id], timelineOrb), 450);
      }
      reachedStates[id] = isReached;

      if (isReached) {
        timelineMarkers[id].classList.add('reached');
      } else {
        timelineMarkers[id].classList.remove('reached');
      }
    });

    requestAnimationFrame(timelineLoop);
  }

  // Export functions to window so main can trigger updates
  window.Timeline = {
    init: function() {
      initSectionTops();
      updateTimeline();
      if (!reduced) {
        requestAnimationFrame(timelineLoop);
      }
    },
    update: updateTimeline,
    recalculate: initSectionTops
  };
})();
