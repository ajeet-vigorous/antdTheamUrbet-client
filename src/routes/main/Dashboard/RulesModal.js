import { Button, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { localstorage_id } from "../../../constants/global";

const RulesModal = ({onConfirm,modalOpen}) => {

  const history = useHistory()
  const handelLogout = () => {
    localStorage.clear()
    history.push('/main/signin')
    window.location.reload()

  }

  useEffect(() => {
    const hasReloaded = localStorage.getItem('hasReloaded');
    const isMobileScreen = window.innerWidth <= 1024;
    if (modalOpen && isMobileScreen && !hasReloaded) {
      localStorage.setItem('hasReloaded', 'true'); 
      window.location.reload(); 
    }
  }, []);


  return (
    <Modal
      open={true}
      centered
      title={`Rules / नियम`}
      onCancel={onConfirm}
      footer={
        <div>
          <Button className="gx-bg-grey gx-text-white gx-font-weight-semi-bold" onClick={onConfirm}>Agree</Button>
          <Button style={{backgroundColor:"rgb(90, 90, 90)"}} className="gx-text-white gx-font-weight-semi-bold" onClick={handelLogout}>Cancel</Button>
        </div>
      }
      width={750}
      className="gx-px-3 gx-my-4"

    >
 <ol style={{lineHeight:"2rem"}} >
        <li>कृपया {localstorage_id} के नियमों को समझने के लिए यहां कुछ मिनट दें, और अपने अनुसार समझ लें।</li>
        <li>सभी डीलर्स से निवेदन है कि क्लाइंट्स को {localstorage_id} के रूल्स समझाने के बाद ही सौदे करवायें।</li>
        <li>अगर आप इस एग्रीमेंट को ऐक्सेप्ट नहीं करते हैं तो कोई सौदा नहीं कीजिये।</li>
        <li>इंटरनेट कनेक्शन प्रॉब्लम की जिम्मेवारी आपकी रहेगी।</li>
        <li>यहाँ सभी सौदे लेजर से मान्य किये जायेंगे।</li>
        <li>मैच के टाई और रद्द होने पे सारी कंप्लीटेड फैंसी का लेन देन किया जायेगा।</li>
        <li>साइट में किसी भी टेक्निकल Error आने की सूरत में मैच और सेशन में लगी सभी बेट्स का लेन देन होगा।</li>
        <li>अगर किसी भी मैच में भाव और फैंसी में गलत रेट चलने की सूरत में कंपनी अपने राइट्स से बेट्स डिलीट कर सकता है। ऐसी सूरत में कोई भी वाद विवाद मान्य नहीं होगा।</li>
        <li>किसी मैच में रिजल्ट गलत हो जाने की सूरत में मैच खत्म हो जाने के बाद भी उसे सही किया जा सकता है। इस सिचुएशन में कोई भी वाद विवाद मान्य नहीं होगा।</li>
        <li>अगर एक्सचेंज में कोई भी चीट बेट्स पाई जाती है तो बिना किसी वाद विवाद के उसे कंपनी की तरफ से डिलीट कर दिया जायेगा।</li>
        <li>एक्सचेंज का स्कोरबोर्ड थर्ड पार्टी से लिया गया है। उसे देख कर सौदे करने पर एक्सचेंज जिम्मेदार नहीं होगा।</li>
        <li>कंपनी द्वारा दिया गया पासवर्ड आपको खुद चेंज करना है। यह आपकी अपनी जिम्मेदारी है, इसके लिए कंपनी से कोई भी वाद विवाद मान्य नहीं होगा।</li>
        <li>अगर चलते मैच में किसी भी टेक्निकल इश्यू की वजह से एक्सचेंज डाउन होता है तो उस मैच और सेशन पर लगी हुई सभी बेट्स का लेन देन होगा। इस सिचुएशन में कोई वाद विवाद मान्य नहीं होगा।</li>
        {/* <li>अगर कोई भी प्लेयर बल्क बेट्स करता हुआ पाया गया, उसकी जीती हुई सारी बेट्स निकल दी जाएगी। इसमें कंपनी का डिसिशन फाइनल होगा।</li>
        <li>अगर कोई प्लेयर फिक्सिंग कर रहा है और कंपनी की नॉलेज में वो बात आ गयी, तो सारी बेट्स रिवर्स कर दी जाएगी। कंपनी का डिसिशन फाइनल होगा।</li> */}
    </ol>
    </Modal>
  );
};

export default RulesModal;

