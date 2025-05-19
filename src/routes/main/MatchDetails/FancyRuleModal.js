import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';

function FancyRuleModal({closeFancyRuleModal}) {
  const [toggleLanguage,setToggleLanguage] = useState("hindi")
  
  return (
    <Modal
      open={true}
      title="Session Book"
      onCancel={closeFancyRuleModal}
      footer={null}
      className="gx-px-3"
    >
       <Row>
    <Col>
    <div className='gx-text-center'>
      <Button onClick={()=>{setToggleLanguage("hindi")}} className='gx-bg-cyan gx-font-weight-semi-bold gx-fs-lg gx-text-white' >Hindi</Button>
      <Button onClick={()=>{setToggleLanguage("english")}} className='gx-bg-cyan gx-font-weight-semi-bold gx-fs-lg gx-text-white' >English</Button>
    </div>
    {toggleLanguage === "hindi" &&  <div id='Hindi'>
     <strong>Fancy Rules</strong>
    <ol>
        <li>मैच के टाई होने पर सभी फैंसी बेटस को मान्य किया जाएगा।</li>
        <li>टॉस या मौसम की स्थिति से पहले सभी एडवांस फैंसी को कैंसिल कर दिया जाएगा।</li>
        <li>यदि किसी भी स्थिति में फैंसी में गलत रेट दिया गया है, तो वह बेट रद्द कर दी जाएगी।</li>
        <li>यदि ग्राहक गलत तरीके से बेटस लगाते हैं तो हम हटाने के लिए उत्तरदायी नहीं हैं, कोई बदलाव नहीं किया जाएगा और बेटस को पक्का माना जाएगा।</li>
        <li>किसी भी परिस्थिति में मैनेजमेंट का निर्णय अंतिम होगा।</li>
        <li>किसी भी तकनीकी खराबी के कारण मार्किट खुला है और रिजल्ट आ गया है रिजल्ट के बाद सभी बेटस हटा दिए जाएंगे।</li>
        <li>एडवांस में फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आए हों तो फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो उस खिलाड़ी की फैंसी हटा दी जाएगी।</li>
        <li>यदि नो बॉल के मामले में, गलत बेटस हटा दिए जाएंगे, तो अंतिम निर्णय मैनेजमेंट का होगा।</li>
        <li>1stwkt 2ndwkt और पहली 3rdwkt एडवांस फैंसी केवल पहली पारी में मान्य है।</li>
    </ol>

    <strong>Test Rules</strong>
    <ol>
        <li>पूर्ण फ़ैन्सी सिर्फ़ पहली पारी में मान्य होगी।</li>
        <li>मिडिल सेशन और पारी घोषित या ऑल आउट के कारण पूरा नहीं हुआ है ताकि विशेष ओवर को पूरा माना जाए और अगली टीम की पारी में शेष ओवर की गिनती की जाए: - पारी घोषित या ऑल आउट होने की स्थिति में 131.5 वें ओवर में 132 ओवर पूरा माना जाता है शेष 1 ओवर मिडिल सत्र के लिए 133 और अगली टीम पारी और एक ओवर सेशन से 135 ओवर सेशन के लिए गिना गया और पारी घोषित होने के कारण केवल ओवर सेशन पूरा नहीं हुआ है ताकि विशेष ओवर सेशन के दांव हटा दिए जाएंगे और ऑल आउट के रूप में माना जाएगा पूर्व के लिए मान्य: - 131.5 वें ओवर में घोषित पारी के मामले में 132 ओवर हटा दिए जाएंगे और यदि ऑल आउट हो तो 132 ओवर और केवल 132 ओवर ही मान्य होंगे।</li>
        <li>टेस्ट मैच दोनों एडवांस सेशन मान्य है।</li>
        <li>यदि बल्लेबाज़ चोटिल होता है और वह 34 रन बना लेता है तो रिजल्ट में 34 रन दिए जाते हैं।</li>
        <li>बल्लेबाज 50/100 रन अगर बल्लेबाज चोटिल हो जाता है या घोषणा करता है तो रिजल्ट उसके रन पर दिया जाएगा।</li>
        <li>टेस्ट मैच में दोनों एडवांस फैंसी बल्लेबाजों का रन वैध है।</li>
    </ol>

    <strong>ODI Rules</strong>
    <ol>
        <li>मैच के पहले ओवर के रन एडवांस फैंसी के केवल पहली पारी के रन गिने जाएंगे।</li>
        <li>बारिश या मैच रद्द होने की स्थिति में पूरा सेशन मान्य है, विशेष सेशन हटा दिया जाएगा।</li>
        <li>35 ओवर रन टीम ए किसी भी मामले में खेल रही है टीम ए 33 ओवर में ऑल आउट हो गई है टीम ए ने 150 रन बनाए हैं, सेशन परिणाम विशेष रन पर मान्य है।</li>
        <li>यदि बल्लेबाज़ चोटिल होता है तो वह 34 रन बना लेता है और परिणाम में 34 रन दिए जाते हैं।</li>
        <li>एडवांस सेशन केवल पहली पारी में मान्य है।</li>
        <li>यदि 50 ओवर पूरे नहीं होते हैं तो मौसम या किसी भी स्थिति के कारण सभी बेट हटा दी जाएंगी।</li>
        <li>एडवांस 50 ओवर रन केवल पहली पारी में मान्य है।</li>
        <li>चार, छक्के, वाइड, विकेट, अतिरिक्त रन, कुल रन, उच्चतम ओवर, शीर्ष बल्लेबाज, मेडेन ओवर, कैच-आउट, नो-बॉल, रन-आउट, अर्धशतक और शतक मान्य हैं केवल मैच बारिश के कारण पूरा हो गया है ओवर कम कर दिया गया है अन्य सभी फैंसी हटा दिए जाएंगे।</li>
        <li>एडवांस में फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आए हों तो फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो विशेष खिलाड़ी फैंसी हटा दी जाएगी।</li>
    </ol>

    <strong>T20 Rules</strong>
    <ol>
        <li>मैच के पहले ओवर के रन एडवांस फैंसी के केवल पहली पारी के रन गिने जाएंगे।</li>
        <li>बारिश या मैच परित्यक्त होने की स्थिति में पूरा सेशन मान्य है, विशेष सेशन हटा दिया जाएगा।</li>
        <li>15 ओवर रन टीम ए किसी भी मामले में खेल रही है टीम ए 13 ओवर में ऑल आउट हो गई है टीम ए ने 100 रन बनाए हैं, सेशन परिणाम विशेष रन पर मान्य है।</li>
        <li>यदि बल्लेबाज़ चोटिल होता है तो वह 34 रन बना लेता है और परिणाम में 34 रन दिए जाते हैं।</li>
        <li>एडवांस सेशन केवल पहली पारी में मान्य है।</li>
        <li>एडवांस 20 ओवर रन केवल पहली पारी में मान्य है। किसी भी स्थिति के कारण 20 ओवर पूरे नहीं होने पर 20 ओवर का रन वैध नहीं माना जाएगा।</li>
        <li>एडवांस में फैंसी ओपनिंग बल्लेबाज केवल तभी मान्य होते हैं जब वही बल्लेबाज ओपनिंग में आए हों तो फैंसी मान्य होगी यदि एक बल्लेबाज को बदल दिया जाता है तो विशेष खिलाड़ी फैंसी हटा दी जाएगी।</li>
        <li>चार, छक्के, वाइड, विकेट, अतिरिक्त रन, कुल रन, उच्चतम ओवर, शीर्ष बल्लेबाज, मेडेन ओवर, कैच-आउट, नो-बॉल, रन-आउट, अर्धशतक और शतक मान्य हैं केवल मैच बारिश के कारण पूरा हो गया है ओवर कम कर दिया गया है अन्य सभी फैंसी हटा दिए जाएंगे।</li>
    </ol>
     </div>}
   {toggleLanguage === 'english' &&  <div id='English'>
     <strong>Fancy Rules</strong>
    <ol>
        <li>All fancy bets will be validated when the match has been tied.</li>
        <li>All advance fancy will be suspended before toss or weather condition.</li>
        <li>If in any case the wrong rate has been given in fancy, that particular bet will be canceled.</li>
        <li>In case customers make bets in wrong fancy we are not liable to delete, no changes will be made and bets will be considered as confirmed bets.</li>
        <li>In any circumstances management decision will be final related to all exchange items.</li>
        <li>Due to any technical error the market is open and result has come, all bets after result will be deleted.</li>
        <li>In advance fancy opening batsmen is only valid if same batsmen came in opening; the fancy will be valid. In case one batsman is changed, that particular player fancy will be deleted.</li>
        <li>If in case of NO BALL, wrong bets will be deleted; the final decision will be management.</li>
        <li>1st 2wkt & 1st 3wkt advance fancy only valid in First Inning.</li>
    </ol>

    <strong>Test Rules</strong>
    <ol>
        <li>Complete session valid in test.</li>
        <li>Middle session and Session is not completed due to Innings declared or all out so that particular over considered as completed and remaining over counted in next team Innings for example: In case of Innings declared or all out In 131.5th over, Considered as 132 over completed. Remaining 1 over counted for 133 over middle session and 3 overs counted for 135 over session from next team Innings. One over session and only over session is not completed due to innings declared so that particular over session bets will be deleted and all out considered as valid. For example: In case of Innings declared In 131.5th over so 132 over will be deleted and if all out then 132 over and only 132 over will be valid.</li>
        <li>Test match both advance session is valid.</li>
        <li>In case batsman is injured and he/she makes 34 runs, the result will be given 34 runs.</li>
        <li>Batsman 50/100 run if batsman is injured or declaration, the result will be given on particular run.</li>
        <li>Test match both advance fancy batsmen run is valid.</li>
    </ol>

    <strong>ODI Rules</strong>
    <ol>
        <li>Match 1st over run advance fancy only 1st innings run will be counted.</li>
        <li>Complete session is valid in case due to rain or match abandoned, particular session will be deleted.</li>
        <li>35 over run team A is playing any case team A is all-out in 33 over, team A has made 150 run; the session result is validated on particular run.</li>
        <li>In case batsman is injured and he/she makes 34 runs, the result will be given 34 runs.</li>
        <li>Advance session is valid in only 1st innings.</li>
        <li>In case 50 overs are not completed, all bets will be deleted due to weather or any condition.</li>
        <li>Advance 50 over runs is valid only in 1st innings.</li>
        <li>In advance fancy opening batsmen is only valid if same batsmen came in opening; the fancy will be valid. In case one batsman is changed, that particular player fancy will be deleted.</li>
        <li>Four, sixes, wide, wicket, extra run, total run, highest over, top batsman, maiden over, caught-out, no-ball, run-out, fifty, and century are valid only if match has been completed. In case due to rain overs have been reduced, all other fancy will be deleted.</li>
    </ol>

    <strong>T20 Rules</strong>
    <ol>
        <li>Match 1st over run advance fancy only 1st innings run will be counted.</li>
        <li>Complete session is valid in case due to rain or match abandoned, particular session will be deleted.</li>
        <li>15 over run team A is playing any case team A is all-out in 13 over, team A has made 100 run; the session result is validated on particular run.</li>
        <li>In case batsman is injured and he/she makes 34 runs, the result will be given 34 runs.</li>
        <li>Advance session is valid in only 1st innings.</li>
        <li>Advance 20 over run is valid only in 1st innings. 20 over run will not be considered as valid if 20 overs are not completed due to any situation.</li>
        <li>In advance fancy opening batsmen is only valid if same batsmen came in opening; the fancy will be valid. In case one batsman is changed, that particular player fancy will be deleted.</li>
        <li>Four, sixes, wide, wicket, extra run, total run, highest over, top batsman, maiden over, caught-out, no-ball, run-out, fifty, and century are valid only if match has been completed. In case due to rain overs have been reduced, all other fancy will be deleted.</li>
    </ol>
     </div>}
    </Col>
  </Row>
    </Modal>
  );
}

export default FancyRuleModal;

