<template>
  <section class="mu_c_card">
    <header class="mu_c_card_header">
      <span class="mu_a_headline_1">Impact by App </span>
      <!-- Was unable to get styles working so a `Learn more?` was put in place of an info icon -->
      <!-- The tooltip hover should denote that the values displayed are placed between 0 and 100 (not scaled or zoomed in/out) -->
      <span v-tooltip="'These are the apps you use and how they\'re impacting your mood'" style="color: grey">Learn more?</span>
    </header>
    <!-- viewBox height is generated since length of `scores` is indeterminate -->
    <svg
      height='100%'
      width='100%'
      :viewBox="'0 0 800 ' + (headerThickness + gapToFirstRow + scores.length * rowGap + textFontSize)"
    >
      <!-- Header of table -->
      <g>
        <!-- Some of the attributes including `fill`, `font-weight` and `font-size` would be better handled using classes/styles -->
        <rect width="100%" :height="headerThickness" fill="rgba(128,128,128,0.2)"/>
        <!-- The "IMPACT" text in table header -->
        <text :y="(headerThickness-(headerFontSize+2))/2 + (headerFontSize)" x="5" fill="grey" font-weight="bold" :font-size="headerFontSize + 'px'">IMPACT</text>
        <!-- Text representing "LOW AVERAGE" -->
        <text :y="(headerThickness-(headerFontSize+2))/2 + (headerFontSize)" :x="getXOnScoreline(average)-8*headerFontSize" fill="grey" font-weight="bold" :font-size="headerFontSize + 'px'">LOW AVERAGE</text>
        <!-- Text representing "HIGH AVERAGE" -->
        <text :y="(headerThickness-(headerFontSize+2))/2 + (headerFontSize)" :x="getXOnScoreline(average)+headerFontSize/2" fill="grey" font-weight="bold" :font-size="headerFontSize + 'px'">HIGH AVERAGE</text>
      </g>
      <!-- Each <g> is associated with a single row -->
      <g v-for="(score, index) in scores" :key="index">
        <!-- The vertical bar for the 10th percentile result -->
        <rect :x="getXOnScoreline(score.low)" :y="getYOfRow(index)-barHeight" :width="barWidth" :height="barHeight" style="fill:lightgrey;" />
        <!-- The vertical bar for the 90th percentile result -->
        <rect :x="getXOnScoreline(score.high)" :y="getYOfRow(index)-barHeight" :width="barWidth" :height="barHeight" style="fill:lightgrey;" />
        <!-- The horizontal bar connecting the low/high values -->
        <rect :x="getXOnScoreline(score.low)" :y="getYOfRow(index)-barHeight+barHeight/2-barWidth/2" :width="(score.high-score.low)*4" :height="barWidth" style="fill:lightgrey" />
        <!-- The name of the application -->
        <text :y="headerThickness+gapToFirstRow+index*rowGap" :font-size="textFontSize">{{score.name}}</text>
        <!-- The time spent in the application -->
        <text :x="timeXPosition" :y="headerThickness+gapToFirstRow+index*rowGap" text-anchor="end" :font-size="textFontSize">{{formatTime(score.time)}}</text>
        <!-- There is no way to manipulate border for svg rects so this is a hack-y way to generate same effect -->
        <rect :x="getXOnScoreline(score.average)-resultBoxWidth/2-2" :y="getYOfRow(index)+getResultBoxOffset()-2" :width="resultBoxWidth+4" :height="resultBoxHeight+4" fill="white" rx="10" />
        <!-- The alternating row background color (with static vertical offset)-->
        <rect x=0 :y="getYOfRow(index)-gapToFirstRow-2.5" width="100%" :height="rowGap" :style="index % 2 == 1 ? 'fill:rgba(140, 146, 172,0.15)' : 'fill:rgba(255,255,255,0)'"/>
        <!-- The box representing the average score for a single entry -->
        <rect :x="getXOnScoreline(score.average)-resultBoxWidth/2" :y="getYOfRow(index)+getResultBoxOffset()" :width="resultBoxWidth" :height="resultBoxHeight" :style="'fill:' + (score.average > average ? '#79c3bc' : '#7991c7')" rx="10" />
        <!-- The text indicating the average score (placed inside box) -->
        <text :x="getXOnScoreline(score.average)+getResultTextHorizontalOffset()" :y="getYOfRow(index)+getResultBoxOffset()+getResultTextVerticalOffset()" fill="white" font-weight="bold" :font-size="resultBoxFont">{{score.average}}</text>
      </g>
      <!-- Final average -->
      <g>
        <!-- Text description for final average -->
        <text :y="getYOfRow(scores.length)" :font-size="textFontSize">Weekly Wellness Average:</text>
        <!-- Vertical bar that cross through all lines and represents final average -->
        <rect :x="getXOnScoreline(average)-barWidth/2" :y="0" :width="barWidth" :height="getYOfRow(scores.length)" fill="rgba(102, 191, 234, 0.2)" />
        <!-- There is no way to manipulate border for svg rects so this is a hack-y way to generate same effect -->
        <rect :x="getXOnScoreline(average)-resultBoxWidth/2-2" :y="getYOfRow(scores.length)+getResultBoxOffset()-2" :width="resultBoxWidth+4" :height="resultBoxHeight+4" fill="white" rx="10" />
        <!-- Box representing final average on bottom of component -->
        <rect :x="getXOnScoreline(average)-resultBoxWidth/2" :y="getYOfRow(scores.length)+getResultBoxOffset()" :width="resultBoxWidth" :height="resultBoxHeight" fill="rgba(102, 191, 234, 1)" rx="10" />
        <!-- Text indicating final average (placed inside box) -->
        <text :x="getXOnScoreline(average)+getResultTextHorizontalOffset()" :y="getYOfRow(scores.length)+getResultBoxOffset()+getResultTextVerticalOffset()" fill="white" font-weight="bold" :font-size="resultBoxFont">{{average}}</text>
      </g>
    </svg>
  </section>
</template>

<script>
export default {
  name: 'ImpactResults',
  data() {
    return {
      // Gap between rows
      rowGap: 50,
      // Width of any score line related rectangle
      barWidth: 5,
      // Height of any score line related rectangle
      barHeight: 20,
      // Thickness (in pixels) of header
      headerThickness: 25,
      // Font-size of text in header
      headerFontSize: 18,
      // Width of rounded rectangle/result box (the ones that surround numerical scores)
      resultBoxWidth: 36,
      // Height of rounded rectangle/result box (the ones that surround numerical scores)
      resultBoxHeight: 30,
      // Font-size for text in result boxes
      resultBoxFont: 23,
      // X-coord (in pixels) of right side of <text> tag (right side so text is visibly right-aligned)
      timeXPosition: 250,
      // Gap between bottom of header and first row
      gapToFirstRow: 30,
      // X-coord (in pixels) for where score line related tags should be placed with respect to
      startScoreLineX: 350,
      // Font-size for all non- result box text
      textFontSize: 20,
    }
  },
  props: {
    // Array of objects with structure:
    /*
      {
        name: String,
        time: Number,
        low: Number,
        high: Number,
        average: Number
      }
    */
    scores: Array,
    // Overall average
    average: Number
  },
  methods: {
    // formats seconds to human readable format
    formatTime(time) {
      if (time > 3600) {
        return `${time % 3600 === 0 ? (time / 3600) :  (time / 3600).toFixed(1)} hrs`
      } else if (time > 60) {
        return `${time % 60 === 0 ? (time / 60) :  (time / 60).toFixed(1)} min`
      } else {
        return `${time} seconds`;
      }
    },
    // Gets x-coord for objects on or related to the "score line"
    getXOnScoreline(value) {
      return this.startScoreLineX+value*4
    },
    // Gets y-coord for a given row with index `index`
    getYOfRow(index) {
      return this.headerThickness+this.gapToFirstRow+index*this.rowGap
    },
    // Gets vertical offset for a result box (with respect to y-coord of row)
    getResultBoxOffset() {
      return (this.resultBoxHeight-this.barHeight)/2 - this.resultBoxHeight
    },
    // Gets horizontal offset for text within result box (with respect to x-coord of result box)
    getResultTextHorizontalOffset() {
      return (this.resultBoxWidth-this.resultBoxFont-2)/2 - this.resultBoxWidth/2
    },
    // Gets vertical offset for text within result box (with respect to y-coord of result box)
    getResultTextVerticalOffset() {
      return this.resultBoxFont+(this.resultBoxHeight-this.resultBoxFont-2)/8
    }
  }
}
</script>

<style lang="scss" module>
/* ------------------------------------------
Base Settings
-------------------------------------------*/
:root {
  // COLORS
  --mu_color_grey_0: #ffffff; /* white */
  --mu_color_grey_1: #f0f0fc;
  --mu_color_grey_2: #e9e9ff;
  --mu_color_grey_3: #dedeff;
  --mu_color_grey_4: #c5c5ea;
  --mu_color_grey_5: #a1a1ce;
  --mu_color_grey_6: #8e8eba;
  --mu_color_grey_7: #7878a3;
  --mu_color_grey_8: #57577a1;
  --mu_color_grey_9: #363a4f;
  --mu_color_grey_10: #000000; /* black */

  --mu-color_primary_lt: #78f7ff;
  --mu_color_primary: #30c4fe;
  --mu_color_primary_dk: #0093cb;

  --mu_gradient_neg_start: #c6c6ff;
  --mu_gradient_neg_end: #49499d;

  --mu_gradient_pos_start: #a7f2e4;
  --mu_gradient_pos_end: #27bfce;

  --mu_color_grad_0: #7fffd1; // Lighest
  --mu_color_grad_1: #61f7cf;
  --mu_color_grad_2: #3aedd8;
  --mu_color_grad_3: #0ee0e0;
  --mu_color_grad_4: #05c8e2;
  --mu_color_grad_5: #37b2e2;
  --mu_color_grad_6: #519be5;
  --mu_color_grad_7: #5280dd;
  --mu_color_grad_8: #4858b7;
  --mu_color_grad_9: #3a3a87; // Darkest

  --mu_chart_header_bg: var(--mu_color_grey_1);
  --mu_chart_header_color: var(--mu_color_grey_6);

  // Font Size
  --mu_fs_button: 14px;
  --mu_fs_copy_sm: 12px;
  --mu_fs_copy_xs: 10px;
  --mu_fs_copy: 14px;
  --mu_fs_suphead: 18px;
  --mu_fs_subhead: 24px;
  --mu_fs_headline: 24px;
  --mu_fs_title: 30px;
  --mu_fs_xxl: 96px;

  --mu_fs_char_header: var(--mu_fs_copy_xs);

  --mu_space_xxs: 0.25rem; //4px
  --mu_space_xs: 0.5rem; // 8px
  --mu_space_sm: 0.75rem; // 12px
  --mu_space_md: 1rem; // 16px
  --mu_space_lg: 1.25rem; // 20px
  --mu_space_xl: 1.5rem; // 24px
  --mu_space_xxl: 1.75rem; // 28px

  // Cross Component Values
  --mu_o_sidebar_width: calc(var(--mu_space_xxl) * 7);
}

/* ------------------------------------------
Reset

   Note: Basic simple reset
   http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)

-------------------------------------------*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
  display: block;
}
body {
  line-height: 1;
}
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

// https://www.paulirish.com/2012/box-sizing-border-box-ftw/
* {
  box-sizing: border-box;
}

/* ------------------------------------------
Icons
-------------------------------------------*/
@font-face {
  font-family: 'icomoonfont';
  src: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53257/icomoonfont.eot?pczupa');
  src: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53257/icomoonfont..eot?pczupa#iefix')
      format('embedded-opentype'),
    url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53257/icomoonfont..ttf?pczupa')
      format('truetype'),
    url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53257/icomoonfont..woff?pczupa')
      format('woff'),
    url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/53257/icomoonfont.svg?pczupa#icomoonfont')
      format('svg');
  font-weight: normal;
  font-style: normal;
  font-display: block;
}

// Icons
.mu_i_chartTitle:before {
  color: #fff;
  display: inline-block;
  padding-right: 5px;
}

[class^='icon-'],
[class*=' icon-'] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: 'icomoonfont' !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-error:before {
  content: '\e900';
}
.icon-error_outline:before {
  content: '\e901';
}
.icon-warningreport_problem:before {
  content: '\e94b';
}
.icon-add_alert:before {
  content: '\e902';
}
.icon-notification_important:before {
  content: '\e903';
}
.icon-equalizer:before {
  content: '\e904';
}
.icon-loopsync:before {
  content: '\e905';
}
.icon-new_releases:before {
  content: '\e906';
}
.icon-not_interesteddo_not_disturb:before {
  content: '\e907';
}
.icon-queue_music:before {
  content: '\e9ba';
}
.icon-music_video:before {
  content: '\e908';
}
.icon-call_made:before {
  content: '\e909';
}
.icon-call_missed:before {
  content: '\e90a';
}
.icon-call_received:before {
  content: '\e90b';
}
.icon-chat:before {
  content: '\e90c';
}
.icon-comment:before {
  content: '\e90d';
}
.icon-contacts:before {
  content: '\e90e';
}
.icon-emailmailmarkunreadlocal_post_office:before {
  content: '\e9bb';
}
.icon-forumquestion_answer:before {
  content: '\e90f';
}
.icon-import_export:before {
  content: '\e910';
}
.icon-live_help:before {
  content: '\e9bc';
}
.icon-location_onplaceroom:before {
  content: '\e911';
}
.icon-message:before {
  content: '\e9bd';
}
.icon-chat_bubble:before {
  content: '\e912';
}
.icon-chat_bubble_outline:before {
  content: '\e913';
}
.icon-contact_mail:before {
  content: '\e914';
}
.icon-swap_calls:before {
  content: '\e9be';
}
.icon-vpn_key:before {
  content: '\e915';
}
.icon-import_contacts:before {
  content: '\e916';
}
.icon-call_missed_outgoing:before {
  content: '\e917';
}
.icon-sentiment_satisfied_alt:before {
  content: '\e918';
}
.icon-lightbulb:before {
  content: '\e9bf';
}
.icon-add:before {
  content: '\e9c0';
}
.icon-add_box:before {
  content: '\e9c1';
}
.icon-add_circle:before {
  content: '\e919';
}
.icon-add_circle_outlinecontrol_point:before {
  content: '\e91a';
}
.icon-archive:before {
  content: '\e9c2';
}
.icon-block:before {
  content: '\e91b';
}
.icon-clearclose:before {
  content: '\e91c';
}
.icon-content_paste:before {
  content: '\e9c3';
}
.icon-createmode_editedit:before {
  content: '\e9c4';
}
.icon-drafts:before {
  content: '\e91d';
}
.icon-flagassistant_photo:before {
  content: '\e91e';
}
.icon-forward:before {
  content: '\e9c5';
}
.icon-gesture:before {
  content: '\e9c6';
}
.icon-redo:before {
  content: '\e9c7';
}
.icon-remove_circledo_not_disturb_on:before {
  content: '\e91f';
}
.icon-remove_circle_outline:before {
  content: '\e920';
}
.icon-send:before {
  content: '\e921';
}
.icon-undo:before {
  content: '\e9c8';
}
.icon-outlined_flag:before {
  content: '\e922';
}
.icon-ballot:before {
  content: '\e9c9';
}
.icon-how_to_reg:before {
  content: '\e923';
}
.icon-waves:before {
  content: '\e924';
}
.icon-access_alarmalarm:before {
  content: '\e925';
}
.icon-access_alarms:before {
  content: '\e9ca';
}
.icon-access_timequery_builderschedule:before {
  content: '\e926';
}
.icon-brightness_auto:before {
  content: '\e9cb';
}
.icon-brightness_highbrightness_7:before {
  content: '\e927';
}
.icon-brightness_lowbrightness_5:before {
  content: '\e928';
}
.icon-brightness_mediumbrightness_6:before {
  content: '\e929';
}
.icon-data_usage:before {
  content: '\e9cc';
}
.icon-mobile_friendly:before {
  content: '\e9cd';
}
.icon-attach_file:before {
  content: '\e92a';
}
.icon-insert_emoticontag_facesmood:before {
  content: '\e92b';
}
.icon-insert_invitationevent:before {
  content: '\e9ce';
}
.icon-table_chart:before {
  content: '\e9cf';
}
.icon-insert_chart_outlined:before {
  content: '\e9b8';
}
.icon-bar_chart:before {
  content: '\e9b9';
}
.icon-cloud:before {
  content: '\e92c';
}
.icon-cloud_circle:before {
  content: '\e92d';
}
.icon-cloud_done:before {
  content: '\e92e';
}
.icon-cloud_download:before {
  content: '\e92f';
}
.icon-cloud_off:before {
  content: '\e930';
}
.icon-cloud_queue:before {
  content: '\e931';
}
.icon-headset:before {
  content: '\e932';
}
.icon-keyboard_arrow_down:before {
  content: '\e933';
}
.icon-keyboard_arrow_left:before {
  content: '\e934';
}
.icon-keyboard_arrow_right:before {
  content: '\e935';
}
.icon-keyboard_arrow_up:before {
  content: '\e936';
}
.icon-keyboard_backspace:before {
  content: '\e937';
}
.icon-keyboard_return:before {
  content: '\e938';
}
.icon-keyboard_tab:before {
  content: '\e939';
}
.icon-laptop_chromebook:before {
  content: '\e93a';
}
.icon-laptop_mac:before {
  content: '\e93b';
}
.icon-security:before {
  content: '\e9d0';
}
.icon-tablet_mac:before {
  content: '\e9d1';
}
.icon-toys:before {
  content: '\e93c';
}
.icon-watch:before {
  content: '\e93d';
}
.icon-audiotrack:before {
  content: '\e93e';
}
.icon-brightness_2:before {
  content: '\e93f';
}
.icon-brightness_3:before {
  content: '\e940';
}
.icon-brightness_4:before {
  content: '\e941';
}
.icon-broken_image:before {
  content: '\e942';
}
.icon-camera_altphoto_cameralocal_see:before {
  content: '\e943';
}
.icon-color_lenspalette:before {
  content: '\e944';
}
.icon-filter_b_and_w:before {
  content: '\e945';
}
.icon-filter_drama:before {
  content: '\e946';
}
.icon-filter_hdrlandscapeterrain:before {
  content: '\e947';
}
.icon-filter_vintage:before {
  content: '\e948';
}
.icon-flash_on:before {
  content: '\e949';
}
.icon-healing:before {
  content: '\e9d2';
}
.icon-looks:before {
  content: '\e94a';
}
.icon-nature:before {
  content: '\e94c';
}
.icon-nature_people:before {
  content: '\e94d';
}
.icon-navigate_beforechevron_left:before {
  content: '\e94e';
}
.icon-navigate_nextchevron_right:before {
  content: '\e94f';
}
.icon-panorama_fish_eyeradio_button_unchecked:before {
  content: '\e950';
}
.icon-straighten:before {
  content: '\e9d3';
}
.icon-timelapse:before {
  content: '\e951';
}
.icon-tonality:before {
  content: '\e952';
}
.icon-tune:before {
  content: '\e953';
}
.icon-wb_cloudy:before {
  content: '\e954';
}
.icon-wb_sunny:before {
  content: '\e955';
}
.icon-movie_filter:before {
  content: '\e956';
}
.icon-photo_filter:before {
  content: '\e957';
}
.icon-music_off:before {
  content: '\e9d4';
}
.icon-beenhere:before {
  content: '\e958';
}
.icon-directions_walk:before {
  content: '\e9d5';
}
.icon-hotellocal_hotel:before {
  content: '\e9d6';
}
.icon-local_atm:before {
  content: '\e959';
}
.icon-local_florist:before {
  content: '\e95a';
}
.icon-local_pharmacy:before {
  content: '\e9d7';
}
.icon-map:before {
  content: '\e95b';
}
.icon-store_mall_directorystore:before {
  content: '\e95c';
}
.icon-traffic:before {
  content: '\e95d';
}
.icon-directions_run:before {
  content: '\e95e';
}
.icon-restaurant:before {
  content: '\e9d8';
}
.icon-train:before {
  content: '\e95f';
}
.icon-category:before {
  content: '\e9d9';
}
.icon-360:before {
  content: '\e9da';
}
.icon-transit_enterexit:before {
  content: '\e9db';
}
.icon-apps:before {
  content: '\e9dc';
}
.icon-arrow_back:before {
  content: '\e960';
}
.icon-arrow_drop_down:before {
  content: '\e9dd';
}
.icon-arrow_drop_up:before {
  content: '\e9de';
}
.icon-arrow_forward:before {
  content: '\e961';
}
.icon-cancel:before {
  content: '\e9df';
}
.icon-check:before {
  content: '\e962';
}
.icon-expand_less:before {
  content: '\e963';
}
.icon-expand_more:before {
  content: '\e964';
}
.icon-keyboard_control:before {
  content: '\e9e0';
}
.icon-more_vert:before {
  content: '\e9e1';
}
.icon-refresh:before {
  content: '\e965';
}
.icon-unfold_less:before {
  content: '\e9e2';
}
.icon-unfold_more:before {
  content: '\e9e3';
}
.icon-arrow_upward:before {
  content: '\e9e4';
}
.icon-subdirectory_arrow_left:before {
  content: '\e9e5';
}
.icon-subdirectory_arrow_right:before {
  content: '\e966';
}
.icon-arrow_downward:before {
  content: '\e967';
}
.icon-arrow_left:before {
  content: '\e968';
}
.icon-arrow_right:before {
  content: '\e969';
}
.icon-arrow_back_ios:before {
  content: '\e96a';
}
.icon-arrow_forward_ios:before {
  content: '\e96b';
}
.icon-event_available:before {
  content: '\e9e6';
}
.icon-event_busy:before {
  content: '\e9e7';
}
.icon-event_note:before {
  content: '\e9e8';
}
.icon-vpn_lock:before {
  content: '\e96c';
}
.icon-enhanced_encryption:before {
  content: '\e96d';
}
.icon-network_check:before {
  content: '\e9e9';
}
.icon-pie_chart:before {
  content: '\e96e';
}
.icon-bubble_chart:before {
  content: '\e96f';
}
.icon-multiline_chart:before {
  content: '\e970';
}
.icon-show_chart:before {
  content: '\e971';
}
.icon-cake:before {
  content: '\e972';
}
.icon-grouppeople:before {
  content: '\e973';
}
.icon-mood_bad:before {
  content: '\e974';
}
.icon-notifications:before {
  content: '\e975';
}
.icon-notifications_none:before {
  content: '\e976';
}
.icon-notifications_active:before {
  content: '\e9ea';
}
.icon-notifications_paused:before {
  content: '\e9eb';
}
.icon-public:before {
  content: '\e977';
}
.icon-sentiment_dissatisfied:before {
  content: '\e978';
}
.icon-sentiment_neutral:before {
  content: '\e979';
}
.icon-sentiment_satisfied:before {
  content: '\e97a';
}
.icon-sentiment_very_dissatisfied:before {
  content: '\e97b';
}
.icon-sentiment_very_satisfied:before {
  content: '\e97c';
}
.icon-thumb_down_alt:before {
  content: '\e9ec';
}
.icon-thumb_up_alt:before {
  content: '\e9ed';
}
.icon-check_box_outline_blank:before {
  content: '\e9ee';
}
.icon-stargrade:before {
  content: '\e9ef';
}
.icon-star_half:before {
  content: '\e9f0';
}
.icon-star_outline:before {
  content: '\e9f1';
}
.icon-account_balance:before {
  content: '\e97d';
}
.icon-account_balance_wallet:before {
  content: '\e97e';
}
.icon-account_circle:before {
  content: '\e97f';
}
.icon-alarm_on:before {
  content: '\e980';
}
.icon-bookclass:before {
  content: '\e981';
}
.icon-bookmark_outlineturned_in_not:before {
  content: '\e9f2';
}
.icon-build:before {
  content: '\e982';
}
.icon-check_circle:before {
  content: '\e9f3';
}
.icon-code:before {
  content: '\e983';
}
.icon-delete:before {
  content: '\e9f4';
}
.icon-done:before {
  content: '\e9f5';
}
.icon-done_all:before {
  content: '\e9f6';
}
.icon-explore:before {
  content: '\e984';
}
.icon-extension:before {
  content: '\e985';
}
.icon-face:before {
  content: '\e986';
}
.icon-favorite:before {
  content: '\e987';
}
.icon-favorite_outline:before {
  content: '\e988';
}
.icon-help:before {
  content: '\e9f7';
}
.icon-highlight_remove:before {
  content: '\e989';
}
.icon-home:before {
  content: '\e98a';
}
.icon-httpslock:before {
  content: '\e9f8';
}
.icon-info:before {
  content: '\e98b';
}
.icon-info_outline:before {
  content: '\e98c';
}
.icon-language:before {
  content: '\e98d';
}
.icon-launchopen_in_new:before {
  content: '\e9f9';
}
.icon-list:before {
  content: '\e9fa';
}
.icon-lock_open:before {
  content: '\e98e';
}
.icon-lock_outline:before {
  content: '\e98f';
}
.icon-redeemcard_giftcard:before {
  content: '\e990';
}
.icon-search:before {
  content: '\e9fb';
}
.icon-settings:before {
  content: '\e991';
}
.icon-settings_input_svideo:before {
  content: '\e9fc';
}
.icon-shopping_basket:before {
  content: '\e992';
}
.icon-swap_horiz:before {
  content: '\e9fd';
}
.icon-swap_vert:before {
  content: '\e9fe';
}
.icon-thumb_down:before {
  content: '\e993';
}
.icon-thumb_up:before {
  content: '\e994';
}
.icon-today:before {
  content: '\e9ff';
}
.icon-trending_down:before {
  content: '\e995';
}
.icon-trending_neutral:before {
  content: '\e996';
}
.icon-trending_up:before {
  content: '\e997';
}
.icon-verified_user:before {
  content: '\e998';
}
.icon-view_column:before {
  content: '\ea00';
}
.icon-view_headline:before {
  content: '\ea01';
}
.icon-view_list:before {
  content: '\ea02';
}
.icon-view_module:before {
  content: '\ea03';
}
.icon-view_quilt:before {
  content: '\ea04';
}
.icon-view_stream:before {
  content: '\ea05';
}
.icon-view_week:before {
  content: '\ea06';
}
.icon-card_travel:before {
  content: '\e999';
}
.icon-work:before {
  content: '\e99a';
}
.icon-fingerprint:before {
  content: '\e99b';
}
.icon-date_range:before {
  content: '\ea07';
}
.icon-timeline:before {
  content: '\ea08';
}
.icon-update:before {
  content: '\e99c';
}
.icon-watch_later:before {
  content: '\e99d';
}
.icon-check_circle_outline:before {
  content: '\e99e';
}
.icon-done_outline:before {
  content: '\ea09';
}
.icon-accessible_forward:before {
  content: '\e99f';
}
.icon-calendar_today:before {
  content: '\ea0a';
}
.icon-supervised_user_circle:before {
  content: '\e9a0';
}
.icon-arrow_right_alt:before {
  content: '\ea0b';
}
.icon-label_important_outline:before {
  content: '\ea0c';
}
.icon-contact_support:before {
  content: '\e9a1';
}
.icon-filter_list_alt:before {
  content: '\ea0d';
}
.icon-circle_notifications:before {
  content: '\ea0e';
}
.icon-dangerous:before {
  content: '\ea0f';
}
.icon-imagesearch_roller:before {
  content: '\e9a2';
}
.icon-stacked_bar_chart:before {
  content: '\e9a3';
}
.icon-stream:before {
  content: '\e9a4';
}
.icon-waterfall_chart:before {
  content: '\ea10';
}
.icon-wb_twighlight:before {
  content: '\e9a5';
}
.icon-bolt:before {
  content: '\ea11';
}
.icon-storefront:before {
  content: '\e9a6';
}
.icon-menu_book:before {
  content: '\e9a7';
}
.icon-emoji_flags:before {
  content: '\e9a8';
}
.icon-emoji_food_beverage:before {
  content: '\ea12';
}
.icon-emoji_nature:before {
  content: '\e9a9';
}
.icon-emoji_people:before {
  content: '\ea13';
}
.icon-people_alt:before {
  content: '\e9aa';
}
.icon-emoji_events:before {
  content: '\e9ab';
}
.icon-sports_esports:before {
  content: '\ea14';
}
.icon-eco:before {
  content: '\e9ac';
}
.icon-deck:before {
  content: '\e9ad';
}
.icon-nights_stay:before {
  content: '\e9ae';
}
.icon-square_foot:before {
  content: '\e9af';
}
.icon-attractions:before {
  content: '\e9b0';
}
.icon-celebration:before {
  content: '\e9b1';
}
.icon-ac_unit:before {
  content: '\e9b2';
}
.icon-airport_shuttle:before {
  content: '\e9b3';
}
.icon-all_inclusive:before {
  content: '\e9b4';
}
.icon-beach_access:before {
  content: '\e9b5';
}
.icon-room_service:before {
  content: '\e9b6';
}
.icon-spa:before {
  content: '\e9b7';
}

/* ------------------------------------------
Typography General
-------------------------------------------*/
.mu_a_headline_1 {
  color: var(--mu_color_grey_9);
  font-size: var(--mu_fs_title);
  font-weight: 400;
  margin: 0 0 var(--mu_space_xs);
}

.mu_a_chartTitle {
  color: var(--mu_color_grey_9);
  font-size: var(--mu_fs_title);
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 var(--mu_space_xxs);
}

.mu_a_copy,
.mu_a_subhead {
  font-weight: 400;
  font-size: 13px;

  line-height: 1.5;
  margin: 0;
  padding: 0;
  color: var(--mu_color_grey_6);
}

/* ------------------------------------------
Utilities
-------------------------------------------*/
.mu_u_wellnessScore {
  color: var(--mu_color_primary);
  font-weight: 700;
}

/* ------------------------------------------
Old things
-------------------------------------------*/
#app {
  display: flex;
  min-height: 100vh;
  justify-content: center;
  flex-direction: column;
  background-color: var(--mu_color_grey_1);
}

.mu-onboarding {
  background: var(--mu_color_grey_0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
</style>
