import React, { useState, useEffect, useMemo } from 'react';
import { X, Building, Search, MapPin } from 'lucide-react';
import '../../assets/css/CitySelector.css';


import delhi from '../../assets/images/delhi.png';
import Mumbai from '../../assets/images/mumbai.png';
import Lucknow from '../../assets/images/lucknow.png';
import Hyderabad from '../../assets/images/hyderabad.png';
import kanpur from '../../assets/images/kanpur.png';
import ahmed from '../../assets/images/ahmed.png';
import Mau from '../../assets/images/mau.png';
import Nashik from '../../assets/images/nasik.png';
import Azamgarh from '../../assets/images/azamgarh.png';
import Prayagraj from '../../assets/images/Prayagraj.png';
import Pune from '../../assets/images/pune.png';
import Jaunpur from '../../assets/images/jaunpur.png';
import Chennai from '../../assets/images/chennai.png';
import Patna from '../../assets/images/patna.png';
import Kolkata from '../../assets/images/kolkata.png';
import Jaipur from '../../assets/images/jaipur.png';
import Indore from '../../assets/images/indore.png';
import Goa from '../../assets/images/goa.png';
import Chandigarh from '../../assets/images/chandigarh.png';
import Bangalore from '../../assets/images/banglore.png';


// All cities data - comprehensive list from API and additional cities
const ALL_CITIES = [
  // Major Metropolitan Cities
  { cityName: 'Mumbai', state: 'Maharashtra', pincode: ['400001'] },
  { cityName: 'Delhi', state: 'Delhi', pincode: ['110001'] },
  { cityName: 'New Delhi', state: 'Delhi', pincode: ['110001'] },
  { cityName: 'Bangalore', state: 'Karnataka', pincode: ['560001'] },
  { cityName: 'Bengaluru', state: 'Karnataka', pincode: ['560001'] },
  { cityName: 'Hyderabad', state: 'Telangana', pincode: ['500001'] },
  { cityName: 'Ahmedabad', state: 'Gujarat', pincode: ['380001'] },
  { cityName: 'Chennai', state: 'Tamil Nadu', pincode: ['600001'] },
  { cityName: 'Kolkata', state: 'West Bengal', pincode: ['700001'] },
  { cityName: 'Pune', state: 'Maharashtra', pincode: ['411001'] },
  { cityName: 'Jaipur', state: 'Rajasthan', pincode: ['302001'] },
  { cityName: 'Surat', state: 'Gujarat', pincode: ['395001'] },
  { cityName: 'Lucknow', state: 'Uttar Pradesh', pincode: ['226001'] },
  { cityName: 'Kanpur', state: 'Uttar Pradesh', pincode: ['208001'] },
  { cityName: 'Nagpur', state: 'Maharashtra', pincode: ['440001'] },
  { cityName: 'Indore', state: 'Madhya Pradesh', pincode: ['452001'] },
  { cityName: 'Thane', state: 'Maharashtra', pincode: ['400601'] },
  { cityName: 'Bhopal', state: 'Madhya Pradesh', pincode: ['462001'] },
  { cityName: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: ['530001'] },
  { cityName: 'Pimpri-Chinchwad', state: 'Maharashtra', pincode: ['411017'] },
  { cityName: 'Patna', state: 'Bihar', pincode: ['800001'] },
  { cityName: 'Vadodara', state: 'Gujarat', pincode: ['390001'] },
  { cityName: 'Ghaziabad', state: 'Uttar Pradesh', pincode: ['201001'] },
  { cityName: 'Ludhiana', state: 'Punjab', pincode: ['141001'] },
  { cityName: 'Agra', state: 'Uttar Pradesh', pincode: ['282001'] },
  { cityName: 'Nashik', state: 'Maharashtra', pincode: ['422001'] },
  { cityName: 'Faridabad', state: 'Haryana', pincode: ['121001'] },
  { cityName: 'Meerut', state: 'Uttar Pradesh', pincode: ['250001'] },
  { cityName: 'Rajkot', state: 'Gujarat', pincode: ['360001'] },
  { cityName: 'Kalyan-Dombivali', state: 'Maharashtra', pincode: ['421201'] },
  { cityName: 'Vasai-Virar', state: 'Maharashtra', pincode: ['401201'] },
  { cityName: 'Varanasi', state: 'Uttar Pradesh', pincode: ['221001'] },
  { cityName: 'Srinagar', state: 'Jammu and Kashmir', pincode: ['190001'] },
  { cityName: 'Aurangabad', state: 'Maharashtra', pincode: ['431001'] },
  { cityName: 'Dhanbad', state: 'Jharkhand', pincode: ['826001'] },
  { cityName: 'Amritsar', state: 'Punjab', pincode: ['143001'] },
  { cityName: 'Navi Mumbai', state: 'Maharashtra', pincode: ['400614'] },
  { cityName: 'Allahabad', state: 'Uttar Pradesh', pincode: ['211001'] },
  { cityName: 'Prayagraj', state: 'Uttar Pradesh', pincode: ['211001'] },
  { cityName: 'Ranchi', state: 'Jharkhand', pincode: ['834001'] },
  { cityName: 'Howrah', state: 'West Bengal', pincode: ['711101'] },
  { cityName: 'Coimbatore', state: 'Tamil Nadu', pincode: ['641001'] },
  { cityName: 'Jabalpur', state: 'Madhya Pradesh', pincode: ['482001'] },
  { cityName: 'Gwalior', state: 'Madhya Pradesh', pincode: ['474001'] },
  { cityName: 'Vijayawada', state: 'Andhra Pradesh', pincode: ['520001'] },
  { cityName: 'Jodhpur', state: 'Rajasthan', pincode: ['342001'] },
  { cityName: 'Madurai', state: 'Tamil Nadu', pincode: ['625001'] },
  { cityName: 'Raipur', state: 'Chhattisgarh', pincode: ['492001'] },
  { cityName: 'Kota', state: 'Rajasthan', pincode: ['324001'] },
  { cityName: 'Guwahati', state: 'Assam', pincode: ['781001'] },
  { cityName: 'Chandigarh', state: 'Chandigarh', pincode: ['160001'] },
  { cityName: 'Solapur', state: 'Maharashtra', pincode: ['413001'] },
  { cityName: 'Hubli-Dharwad', state: 'Karnataka', pincode: ['580020'] },
  { cityName: 'Bareilly', state: 'Uttar Pradesh', pincode: ['243001'] },
  { cityName: 'Moradabad', state: 'Uttar Pradesh', pincode: ['244001'] },
  { cityName: 'Mysore', state: 'Karnataka', pincode: ['570001'] },
  { cityName: 'Gurgaon', state: 'Haryana', pincode: ['122001'] },
  { cityName: 'Gurugram', state: 'Haryana', pincode: ['122001'] },
  { cityName: 'Aligarh', state: 'Uttar Pradesh', pincode: ['202001'] },
  { cityName: 'Jalandhar', state: 'Punjab', pincode: ['144001'] },
  { cityName: 'Tiruchirappalli', state: 'Tamil Nadu', pincode: ['620001'] },
  { cityName: 'Bhubaneswar', state: 'Odisha', pincode: ['751001'] },
  { cityName: 'Salem', state: 'Tamil Nadu', pincode: ['636001'] },
  { cityName: 'Mira-Bhayandar', state: 'Maharashtra', pincode: ['401107'] },
  { cityName: 'Warangal', state: 'Telangana', pincode: ['506001'] },
  { cityName: 'Thiruvananthapuram', state: 'Kerala', pincode: ['695001'] },
  { cityName: 'Guntur', state: 'Andhra Pradesh', pincode: ['522001'] },
  { cityName: 'Bhiwandi', state: 'Maharashtra', pincode: ['421302'] },
  { cityName: 'Saharanpur', state: 'Uttar Pradesh', pincode: ['247001'] },
  { cityName: 'Gorakhpur', state: 'Uttar Pradesh', pincode: ['273001'] },
  { cityName: 'Bikaner', state: 'Rajasthan', pincode: ['334001'] },
  { cityName: 'Amravati', state: 'Maharashtra', pincode: ['444601'] },
  { cityName: 'Noida', state: 'Uttar Pradesh', pincode: ['201301'] },
  { cityName: 'Jamshedpur', state: 'Jharkhand', pincode: ['831001'] },
  { cityName: 'Bhilai', state: 'Chhattisgarh', pincode: ['490001'] },
  { cityName: 'Cuttack', state: 'Odisha', pincode: ['753001'] },
  { cityName: 'Firozabad', state: 'Uttar Pradesh', pincode: ['283203'] },
  { cityName: 'Kochi', state: 'Kerala', pincode: ['682001'] },
  { cityName: 'Bhavnagar', state: 'Gujarat', pincode: ['364001'] },
  { cityName: 'Dehradun', state: 'Uttarakhand', pincode: ['248001'] },
  { cityName: 'Durgapur', state: 'West Bengal', pincode: ['713201'] },
  { cityName: 'Asansol', state: 'West Bengal', pincode: ['713301'] },
  { cityName: 'Nanded', state: 'Maharashtra', pincode: ['431601'] },
  { cityName: 'Kolhapur', state: 'Maharashtra', pincode: ['416001'] },
  { cityName: 'Ajmer', state: 'Rajasthan', pincode: ['305001'] },
  { cityName: 'Akola', state: 'Maharashtra', pincode: ['444001'] },
  { cityName: 'Gulbarga', state: 'Karnataka', pincode: ['585101'] },
  { cityName: 'Jamnagar', state: 'Gujarat', pincode: ['361001'] },
  { cityName: 'Ujjain', state: 'Madhya Pradesh', pincode: ['456001'] },
  { cityName: 'Loni', state: 'Uttar Pradesh', pincode: ['201102'] },
  { cityName: 'Siliguri', state: 'West Bengal', pincode: ['734001'] },
  { cityName: 'Jhansi', state: 'Uttar Pradesh', pincode: ['284001'] },
  { cityName: 'Ulhasnagar', state: 'Maharashtra', pincode: ['421001'] },
  { cityName: 'Nellore', state: 'Andhra Pradesh', pincode: ['524001'] },
  { cityName: 'Jammu', state: 'Jammu and Kashmir', pincode: ['180001'] },
  { cityName: 'Sangli-Miraj & Kupwad', state: 'Maharashtra', pincode: ['416416'] },
  { cityName: 'Belgaum', state: 'Karnataka', pincode: ['590001'] },
  { cityName: 'Mangalore', state: 'Karnataka', pincode: ['575001'] },
  { cityName: 'Ambattur', state: 'Tamil Nadu', pincode: ['600053'] },
  { cityName: 'Tirunelveli', state: 'Tamil Nadu', pincode: ['627001'] },
  { cityName: 'Malegaon', state: 'Maharashtra', pincode: ['423203'] },
  { cityName: 'Gaya', state: 'Bihar', pincode: ['823001'] },
  { cityName: 'Jalgaon', state: 'Maharashtra', pincode: ['425001'] },
  { cityName: 'Udaipur', state: 'Rajasthan', pincode: ['313001'] },
  { cityName: 'Maheshtala', state: 'West Bengal', pincode: ['700141'] },
  
  // Additional Uttar Pradesh Cities
  { cityName: 'Ambedkar Nagar', state: 'Uttar Pradesh', pincode: ['224122'] },
  { cityName: 'Mau', state: 'Uttar Pradesh', pincode: ['275101'] },
  { cityName: 'Jaunpur', state: 'Uttar Pradesh', pincode: ['222001'] },
  { cityName: 'Azamgarh', state: 'Uttar Pradesh', pincode: ['276001'] },
  { cityName: 'Sultanpur', state: 'Uttar Pradesh', pincode: ['228001'] },
  { cityName: 'Ballia', state: 'Uttar Pradesh', pincode: ['277001'] },
  { cityName: 'Basti', state: 'Uttar Pradesh', pincode: ['272002'] },
  { cityName: 'Deoria', state: 'Uttar Pradesh', pincode: ['274001'] },
  { cityName: 'Kushinagar', state: 'Uttar Pradesh', pincode: ['274403'] },
  { cityName: 'Siddharthnagar', state: 'Uttar Pradesh', pincode: ['272207'] },
  { cityName: 'Mathura', state: 'Uttar Pradesh', pincode: ['281001'] },
  { cityName: 'Rampur', state: 'Uttar Pradesh', pincode: ['244901'] },
  { cityName: 'Shahjahanpur', state: 'Uttar Pradesh', pincode: ['242001'] },
  { cityName: 'Farrukhabad', state: 'Uttar Pradesh', pincode: ['209625'] },
  { cityName: 'Muzaffarnagar', state: 'Uttar Pradesh', pincode: ['251001'] },
  { cityName: 'Mirzapur', state: 'Uttar Pradesh', pincode: ['231001'] },
  { cityName: 'Bulandshahr', state: 'Uttar Pradesh', pincode: ['203001'] },
  { cityName: 'Sambhal', state: 'Uttar Pradesh', pincode: ['244302'] },
  { cityName: 'Amroha', state: 'Uttar Pradesh', pincode: ['244221'] },
  { cityName: 'Hardoi', state: 'Uttar Pradesh', pincode: ['241001'] },
  { cityName: 'Fatehpur', state: 'Uttar Pradesh', pincode: ['212601'] },
  { cityName: 'Raebareli', state: 'Uttar Pradesh', pincode: ['229001'] },
  { cityName: 'Orai', state: 'Uttar Pradesh', pincode: ['285001'] },
  { cityName: 'Sitapur', state: 'Uttar Pradesh', pincode: ['261001'] },
  { cityName: 'Bahraich', state: 'Uttar Pradesh', pincode: ['271001'] },
  { cityName: 'Modinagar', state: 'Uttar Pradesh', pincode: ['201204'] },
  { cityName: 'Unnao', state: 'Uttar Pradesh', pincode: ['209801'] },
  { cityName: 'Jind', state: 'Haryana', pincode: ['126102'] },
  { cityName: 'Sangrur', state: 'Punjab', pincode: ['148001'] },
  { cityName: 'Firozpur', state: 'Punjab', pincode: ['152002'] },
  { cityName: 'Patiala', state: 'Punjab', pincode: ['147001'] },
  { cityName: 'Bathinda', state: 'Punjab', pincode: ['151001'] },
  { cityName: 'Hoshiarpur', state: 'Punjab', pincode: ['146001'] },
  { cityName: 'Batala', state: 'Punjab', pincode: ['143505'] },
  { cityName: 'Pathankot', state: 'Punjab', pincode: ['145001'] },
  { cityName: 'Moga', state: 'Punjab', pincode: ['142001'] },
  { cityName: 'Abohar', state: 'Punjab', pincode: ['152116'] },
  { cityName: 'Malerkotla', state: 'Punjab', pincode: ['148023'] },
  { cityName: 'Khanna', state: 'Punjab', pincode: ['141401'] },
  { cityName: 'Phagwara', state: 'Punjab', pincode: ['144401'] },
  { cityName: 'Muktsar', state: 'Punjab', pincode: ['152026'] },
  { cityName: 'Barnala', state: 'Punjab', pincode: ['148101'] },
  { cityName: 'Rajpura', state: 'Punjab', pincode: ['140401'] },
  { cityName: 'Firozabad', state: 'Uttar Pradesh', pincode: ['283203'] },
  { cityName: 'Khurja', state: 'Uttar Pradesh', pincode: ['203131'] },
  { cityName: 'Greater Noida', state: 'Uttar Pradesh', pincode: ['201310'] },

  // More Maharashtra Cities
  { cityName: 'Ichalkaranji', state: 'Maharashtra', pincode: ['416115'] },
  { cityName: 'Jalna', state: 'Maharashtra', pincode: ['431203'] },
  { cityName: 'Ambarnath', state: 'Maharashtra', pincode: ['421501'] },
  { cityName: 'Bhusawal', state: 'Maharashtra', pincode: ['425201'] },
  { cityName: 'Panvel', state: 'Maharashtra', pincode: ['410206'] },
  { cityName: 'Badlapur', state: 'Maharashtra', pincode: ['421503'] },
  { cityName: 'Beed', state: 'Maharashtra', pincode: ['431122'] },
  { cityName: 'Gondia', state: 'Maharashtra', pincode: ['441601'] },
  { cityName: 'Satara', state: 'Maharashtra', pincode: ['415002'] },
  { cityName: 'Barshi', state: 'Maharashtra', pincode: ['413401'] },
  { cityName: 'Yavatmal', state: 'Maharashtra', pincode: ['445001'] },
  { cityName: 'Achalpur', state: 'Maharashtra', pincode: ['444806'] },
  { cityName: 'Osmanabad', state: 'Maharashtra', pincode: ['413501'] },
  { cityName: 'Nandurbar', state: 'Maharashtra', pincode: ['425412'] },
  { cityName: 'Wardha', state: 'Maharashtra', pincode: ['442001'] },
  { cityName: 'Udgir', state: 'Maharashtra', pincode: ['413517'] },
  { cityName: 'Hinganghat', state: 'Maharashtra', pincode: ['442301'] },

  // More Gujarat Cities
  { cityName: 'Anand', state: 'Gujarat', pincode: ['388001'] },
  { cityName: 'Morbi', state: 'Gujarat', pincode: ['363641'] },
  { cityName: 'Mahesana', state: 'Gujarat', pincode: ['384001'] },
  { cityName: 'Bharuch', state: 'Gujarat', pincode: ['392001'] },
  { cityName: 'Vapi', state: 'Gujarat', pincode: ['396191'] },
  { cityName: 'Navsari', state: 'Gujarat', pincode: ['396445'] },
  { cityName: 'Veraval', state: 'Gujarat', pincode: ['362266'] },
  { cityName: 'Porbandar', state: 'Gujarat', pincode: ['360575'] },
  { cityName: 'Godhra', state: 'Gujarat', pincode: ['389001'] },
  { cityName: 'Bhuj', state: 'Gujarat', pincode: ['370001'] },
  { cityName: 'Gandhidham', state: 'Gujarat', pincode: ['370201'] },
  { cityName: 'Nadiad', state: 'Gujarat', pincode: ['387001'] },
  { cityName: 'Morvi', state: 'Gujarat', pincode: ['363642'] },
  { cityName: 'Surendranagar', state: 'Gujarat', pincode: ['363001'] },
  { cityName: 'Gandhinagar', state: 'Gujarat', pincode: ['382010'] },

  // More Tamil Nadu Cities
  { cityName: 'Vellore', state: 'Tamil Nadu', pincode: ['632004'] },
  { cityName: 'Erode', state: 'Tamil Nadu', pincode: ['638001'] },
  { cityName: 'Tiruppur', state: 'Tamil Nadu', pincode: ['641601'] },
  { cityName: 'Thanjavur', state: 'Tamil Nadu', pincode: ['613001'] },
  { cityName: 'Dindigul', state: 'Tamil Nadu', pincode: ['624001'] },
  { cityName: 'Cuddalore', state: 'Tamil Nadu', pincode: ['607001'] },
  { cityName: 'Kumbakonam', state: 'Tamil Nadu', pincode: ['612001'] },
  { cityName: 'Avadi', state: 'Tamil Nadu', pincode: ['600054'] },
  { cityName: 'Tambaram', state: 'Tamil Nadu', pincode: ['600045'] },
  { cityName: 'Alandur', state: 'Tamil Nadu', pincode: ['600016'] },
  { cityName: 'Pallavaram', state: 'Tamil Nadu', pincode: ['600043'] },
  { cityName: 'Tiruchirapalli', state: 'Tamil Nadu', pincode: ['620008'] },
  { cityName: 'Ambur', state: 'Tamil Nadu', pincode: ['635802'] },
  { cityName: 'Ranipet', state: 'Tamil Nadu', pincode: ['632401'] },
  { cityName: 'Karaikudi', state: 'Tamil Nadu', pincode: ['630001'] },
  { cityName: 'Neyveli', state: 'Tamil Nadu', pincode: ['607801'] },
  { cityName: 'Taramani', state: 'Tamil Nadu', pincode: ['600113'] },

  // More Karnataka Cities
  { cityName: 'Davangere', state: 'Karnataka', pincode: ['577001'] },
  { cityName: 'Bellary', state: 'Karnataka', pincode: ['583101'] },
  { cityName: 'Bijapur', state: 'Karnataka', pincode: ['586101'] },
  { cityName: 'Shimoga', state: 'Karnataka', pincode: ['577201'] },
  { cityName: 'Tumkur', state: 'Karnataka', pincode: ['572101'] },
  { cityName: 'Raichur', state: 'Karnataka', pincode: ['584101'] },
  { cityName: 'Bidar', state: 'Karnataka', pincode: ['585401'] },
  { cityName: 'Hospet', state: 'Karnataka', pincode: ['583201'] },
  { cityName: 'Gadag-Betigeri', state: 'Karnataka', pincode: ['582101'] },
  { cityName: 'Udupi', state: 'Karnataka', pincode: ['576101'] },
  { cityName: 'Robertson Pet', state: 'Karnataka', pincode: ['563115'] },
  { cityName: 'Bhadravati', state: 'Karnataka', pincode: ['577301'] },
  { cityName: 'Chitradurga', state: 'Karnataka', pincode: ['577501'] },
  { cityName: 'Hassan', state: 'Karnataka', pincode: ['573201'] },
  { cityName: 'Mandya', state: 'Karnataka', pincode: ['571401'] },

  // More Kerala Cities
  { cityName: 'Kozhikode', state: 'Kerala', pincode: ['673001'] },
  { cityName: 'Kollam', state: 'Kerala', pincode: ['691001'] },
  { cityName: 'Thrissur', state: 'Kerala', pincode: ['680001'] },
  { cityName: 'Alappuzha', state: 'Kerala', pincode: ['688001'] },
  { cityName: 'Kottayam', state: 'Kerala', pincode: ['686001'] },
  { cityName: 'Kannur', state: 'Kerala', pincode: ['670001'] },
  { cityName: 'Palakkad', state: 'Kerala', pincode: ['678001'] },
  { cityName: 'Malappuram', state: 'Kerala', pincode: ['676101'] },
  { cityName: 'Thalassery', state: 'Kerala', pincode: ['670101'] },
  { cityName: 'Kanhangad', state: 'Kerala', pincode: ['671315'] },
  { cityName: 'Payyanur', state: 'Kerala', pincode: ['670307'] },

  // More West Bengal Cities
  { cityName: 'Darjeeling', state: 'West Bengal', pincode: ['734101'] },
  { cityName: 'Alipurduar', state: 'West Bengal', pincode: ['736121'] },
  { cityName: 'Purulia', state: 'West Bengal', pincode: ['723101'] },
  { cityName: 'Raiganj', state: 'West Bengal', pincode: ['733134'] },
  { cityName: 'Bankura', state: 'West Bengal', pincode: ['722101'] },
  { cityName: 'Nabadwip', state: 'West Bengal', pincode: ['741302'] },
  { cityName: 'Medinipur', state: 'West Bengal', pincode: ['721101'] },
  { cityName: 'Jalpaiguri', state: 'West Bengal', pincode: ['735101'] },
  { cityName: 'Balurghat', state: 'West Bengal', pincode: ['733101'] },
  { cityName: 'Basirhat', state: 'West Bengal', pincode: ['743412'] },
  { cityName: 'Krishnanagar', state: 'West Bengal', pincode: ['741101'] },
  { cityName: 'Ranaghat', state: 'West Bengal', pincode: ['741201'] },
  { cityName: 'Haldia', state: 'West Bengal', pincode: ['721607'] },
  { cityName: 'Baharampur', state: 'West Bengal', pincode: ['742101'] },

  // More Rajasthan Cities
  { cityName: 'Alwar', state: 'Rajasthan', pincode: ['301001'] },
  { cityName: 'Bharatpur', state: 'Rajasthan', pincode: ['321001'] },
  { cityName: 'Sikar', state: 'Rajasthan', pincode: ['332001'] },
  { cityName: 'Bhilwara', state: 'Rajasthan', pincode: ['311001'] },
  { cityName: 'Tonk', state: 'Rajasthan', pincode: ['304001'] },
  { cityName: 'Kishangarh', state: 'Rajasthan', pincode: ['305801'] },
  { cityName: 'Beawar', state: 'Rajasthan', pincode: ['305901'] },
  { cityName: 'Hanumangarh', state: 'Rajasthan', pincode: ['335001'] },
  { cityName: 'Sri Ganganagar', state: 'Rajasthan', pincode: ['335001'] },
  { cityName: 'Pali', state: 'Rajasthan', pincode: ['306401'] },
  { cityName: 'Baran', state: 'Rajasthan', pincode: ['325205'] },
  { cityName: 'Churu', state: 'Rajasthan', pincode: ['331001'] },
  { cityName: 'Jhunjhunu', state: 'Rajasthan', pincode: ['333001'] },

  // More Odisha Cities
  { cityName: 'Rourkela', state: 'Odisha', pincode: ['769001'] },
  { cityName: 'Brahmapur', state: 'Odisha', pincode: ['760001'] },
  { cityName: 'Sambalpur', state: 'Odisha', pincode: ['768001'] },
  { cityName: 'Puri', state: 'Odisha', pincode: ['752001'] },
  { cityName: 'Balasore', state: 'Odisha', pincode: ['756001'] },
  { cityName: 'Bhadrak', state: 'Odisha', pincode: ['756100'] },
  { cityName: 'Baripada', state: 'Odisha', pincode: ['757001'] },

  // More Madhya Pradesh Cities
  { cityName: 'Gwalior', state: 'Madhya Pradesh', pincode: ['474001'] },
  { cityName: 'Jabalpur', state: 'Madhya Pradesh', pincode: ['482001'] },
  { cityName: 'Ujjain', state: 'Madhya Pradesh', pincode: ['456001'] },
  { cityName: 'Sagar', state: 'Madhya Pradesh', pincode: ['470001'] },
  { cityName: 'Dewas', state: 'Madhya Pradesh', pincode: ['455001'] },
  { cityName: 'Satna', state: 'Madhya Pradesh', pincode: ['485001'] },
  { cityName: 'Ratlam', state: 'Madhya Pradesh', pincode: ['457001'] },
  { cityName: 'Rewa', state: 'Madhya Pradesh', pincode: ['486001'] },
  { cityName: 'Murwara', state: 'Madhya Pradesh', pincode: ['483501'] },
  { cityName: 'Singrauli', state: 'Madhya Pradesh', pincode: ['486889'] },
  { cityName: 'Burhanpur', state: 'Madhya Pradesh', pincode: ['450331'] },
  { cityName: 'Khandwa', state: 'Madhya Pradesh', pincode: ['450001'] },
  { cityName: 'Morena', state: 'Madhya Pradesh', pincode: ['476001'] },
  { cityName: 'Bhind', state: 'Madhya Pradesh', pincode: ['477001'] },
  { cityName: 'Chhindwara', state: 'Madhya Pradesh', pincode: ['480001'] },
  { cityName: 'Guna', state: 'Madhya Pradesh', pincode: ['473001'] },
  { cityName: 'Shivpuri', state: 'Madhya Pradesh', pincode: ['473551'] },
  { cityName: 'Vidisha', state: 'Madhya Pradesh', pincode: ['464001'] },
  { cityName: 'Chhatarpur', state: 'Madhya Pradesh', pincode: ['471001'] },
  { cityName: 'Damoh', state: 'Madhya Pradesh', pincode: ['470661'] },
  { cityName: 'Mandsaur', state: 'Madhya Pradesh', pincode: ['458001'] },
  { cityName: 'Khargone', state: 'Madhya Pradesh', pincode: ['451001'] },
  { cityName: 'Neemuch', state: 'Madhya Pradesh', pincode: ['458441'] },
  { cityName: 'Pithampur', state: 'Madhya Pradesh', pincode: ['454775'] },

  // Union Territory Cities
  { cityName: 'Pondicherry', state: 'Puducherry', pincode: ['605001'] },
  { cityName: 'Daman', state: 'Daman and Diu', pincode: ['396210'] },
  { cityName: 'Diu', state: 'Daman and Diu', pincode: ['362520'] },
  { cityName: 'Silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', pincode: ['396230'] },
  { cityName: 'Port Blair', state: 'Andaman and Nicobar Islands', pincode: ['744101'] },
  { cityName: 'Kavaratti', state: 'Lakshadweep', pincode: ['682555'] },

  // More Haryana Cities
  { cityName: 'Panipat', state: 'Haryana', pincode: ['132103'] },
  { cityName: 'Ambala', state: 'Haryana', pincode: ['134003'] },
  { cityName: 'Yamunanagar', state: 'Haryana', pincode: ['135001'] },
  { cityName: 'Rohtak', state: 'Haryana', pincode: ['124001'] },
  { cityName: 'Hisar', state: 'Haryana', pincode: ['125001'] },
  { cityName: 'Karnal', state: 'Haryana', pincode: ['132001'] },
  { cityName: 'Sonipat', state: 'Haryana', pincode: ['131001'] },
  { cityName: 'Panchkula', state: 'Haryana', pincode: ['134109'] },
  { cityName: 'Bhiwani', state: 'Haryana', pincode: ['127021'] },
  { cityName: 'Sirsa', state: 'Haryana', pincode: ['125055'] },
  { cityName: 'Thanesar', state: 'Haryana', pincode: ['136118'] },
  { cityName: 'Kaithal', state: 'Haryana', pincode: ['136027'] },
  { cityName: 'Palwal', state: 'Haryana', pincode: ['121102'] },
  { cityName: 'Rewari', state: 'Haryana', pincode: ['123401'] },

  // More Uttarakhand Cities
  { cityName: 'Haridwar', state: 'Uttarakhand', pincode: ['249401'] },
  { cityName: 'Rishikesh', state: 'Uttarakhand', pincode: ['249201'] },
  { cityName: 'Roorkee', state: 'Uttarakhand', pincode: ['247667'] },
  { cityName: 'Haldwani', state: 'Uttarakhand', pincode: ['263139'] },
  { cityName: 'Rudrapur', state: 'Uttarakhand', pincode: ['263153'] },
  { cityName: 'Kashipur', state: 'Uttarakhand', pincode: ['244713'] },
  { cityName: 'Pithoragarh', state: 'Uttarakhand', pincode: ['262501'] },

  // More Himachal Pradesh Cities
  { cityName: 'Shimla', state: 'Himachal Pradesh', pincode: ['171001'] },
  { cityName: 'Mandi', state: 'Himachal Pradesh', pincode: ['175001'] },
  { cityName: 'Solan', state: 'Himachal Pradesh', pincode: ['173212'] },
  { cityName: 'Nahan', state: 'Himachal Pradesh', pincode: ['173001'] },
  { cityName: 'Kullu', state: 'Himachal Pradesh', pincode: ['175101'] },
  { cityName: 'Manali', state: 'Himachal Pradesh', pincode: ['175131'] }
];

const CityPopup = ({ cities, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const cityIcons = {
    'Mumbai': (props) => <img src={Mumbai} alt="Mumbai" {...props} className="city-image" />,
    'Delhi': (props) => <img src={delhi} alt="Delhi" {...props} className="city-image" />,
    'Delhi - NCR': (props) => <img src={delhi} alt="Delhi - NCR" {...props} className="city-image" />,
    'Bangalore': (props) => <img src={Bangalore} alt="Bangalore" {...props} className="city-image" />,
    'Chennai': (props) => <img src={Chennai} alt="Chennai" {...props} className="city-image" />,
    'Patna': (props) => <img src={Patna} alt="Patna" {...props} className="city-image" />,
    'Kolkata': (props) => <img src={Kolkata} alt="Kolkata" {...props} className="city-image" />,
    'Jaipur': (props) => <img src={Jaipur} alt="Jaipur" {...props} className="city-image" />,
    'Indore': (props) => <img src={Indore} alt="Indore" {...props} className="city-image" />,
    'Goa': (props) => <img src={Goa} alt="Goa" {...props} className="city-image" />,
    'Chandigarh': (props) => <img src={Chandigarh} alt="Chandigarh" {...props} className="city-image" />,
    'Gandhinagar': (props) => <img src={Mau} alt="Gandhinagar" {...props} className="city-image" />,
    'Siliguri': (props) => <img src={Indore} alt="Siliguri" {...props} className="city-image" />,
    'Jammu': (props) => <img src={Azamgarh} alt="Jammu" {...props} className="city-image" />,
    'Azamgarh': (props) => <img src={Azamgarh} alt="Azamgarh" {...props} className="city-image" />,
    'Lucknow': (props) => <img src={Lucknow} alt="Lucknow" {...props} className="city-image" />,
    'Prayagraj': (props) => <img src={Prayagraj} alt="Prayagraj" {...props} className="city-image" />,
    'Allahabad': (props) => <img src={Prayagraj} alt="Allahabad" {...props} className="city-image" />,
    'Hyderabad': (props) => <img src={Hyderabad} alt="Hyderabad" {...props} className="city-image" />,
    'Ambedkar Nagar': (props) => <img src={ahmed} alt="Ambedkar Nagar" {...props} className="city-image" />,
    'Mau': (props) => <img src={Mau} alt="Mau" {...props} className="city-image" />,
    'Nashik': (props) => <img src={Nashik} alt="Nashik" {...props} className="city-image" />,
    'Pune': (props) => <img src={Pune} alt="Pune" {...props} className="city-image" />,
    'Jaunpur': (props) => <img src={Jaunpur} alt="Jaunpur" {...props} className="city-image" />,
    'Kanpur': (props) => <img src={kanpur} alt="Kanpur" {...props} className="city-image" />,
    'Ahmedabad': (props) => <img src={ahmed} alt="Ahmedabad" {...props} className="city-image" />
  };

  // Merge available cities with all cities data
  // Provided city list for both default and available cities
  const providedCities = [
    { cityName: 'Mumbai', state: 'Maharashtra', pincode: ['400001'] },
    { cityName: 'Delhi - NCR', state: 'Delhi', pincode: ['110001'] },
    { cityName: 'Lucknow', state: 'Uttar Pradesh', pincode: ['226001'] },
    { cityName: 'Prayagraj', state: 'Uttar Pradesh', pincode: ['211001'] },
    { cityName: 'Hyderabad', state: 'Telangana', pincode: ['500001'] },
    { cityName: 'Nashik', state: 'Maharashtra', pincode: ['422001'] },
    { cityName: 'Pune', state: 'Maharashtra', pincode: ['411001'] },
    { cityName: 'Kanpur', state: 'Uttar Pradesh', pincode: ['208001'] },
    { cityName: 'Bangalore', state: 'Karnataka', pincode: ['560001'] },
    { cityName: 'Goa', state: 'Goa', pincode: ['403001'] },
    { cityName: 'Jaipur', state: 'Rajasthan', pincode: ['302001'] },
    { cityName: 'Kolkata', state: 'West Bengal', pincode: ['700001'] },
    { cityName: 'Indore', state: 'Madhya Pradesh', pincode: ['452001'] },
    { cityName: 'Ahmedabad', state: 'Gujarat', pincode: ['380001'] },
    { cityName: 'Gandhinagar', state: 'Gujarat', pincode: ['382010'] },
    { cityName: 'Chennai', state: 'Tamil Nadu', pincode: ['600001'] },
    { cityName: 'Chandigarh', state: 'Chandigarh', pincode: ['160001'] },
    { cityName: 'Patna', state: 'Bihar', pincode: ['800001'] },
    { cityName: 'Jammu', state: 'Jammu and Kashmir', pincode: ['180001'] },
    { cityName: 'Siliguri', state: 'West Bengal', pincode: ['734001'] }
  ];

  const availableCities = useMemo(() => {
    return providedCities;
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities([]);
    } else {
      // Only allow searching within the provided city list
      const filtered = providedCities.filter(city =>
        city.cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.state.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 20); // Limit to 20 results for performance
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  const handleCitySelect = (city) => {
    onSelect(city);
  };

  const handleSearchSelect = (city) => {
    onSelect(city);
    setSearchTerm('');
    setShowAllCities(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filteredCities.length > 0) {
      handleSearchSelect(filteredCities[0]);
    }
  };
  return (
    <div className="city-popup-overlay" onClick={handleOverlayClick}>
      <div className="city-popup-modal">
        {/* Header */}
        <div className="city-popup-header">
          <h2 className="city-popup-title">
            {showAllCities ? 'Search Cities' : 'Select your City'}
          </h2>
          <button 
            onClick={onClose}
            className="city-popup-close"
            type="button"
          >
            <X />
          </button>
        </div>

        {/* Content */}
        <div className="city-popup-content">
          <p className="description-text">
            {showAllCities 
              ? 'Search from our comprehensive list of cities'
              : 'Find more than 3000 decorations, gifts and surprises!'
            }
          </p>
        </div>

        {!showAllCities && (
          <>
            {/* Default Cities Grid */}
            <div className="city-grid">
              <div className="cities-container">
                {availableCities?.map((city, index) => {
                  const IconComponent = cityIcons[city.cityName] || ((props) => <Building {...props} size={48} />);
                  return (
                    <button
                      key={index}
                      onClick={() => handleCitySelect(city)}
                      className="city-card"
                      type="button"
                    >
                      <div className="city-icon">
                        <IconComponent />
                      </div>
                      <span className="city-name">
                        {city.cityName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Section */}
            <div className="search-section">
              <div className="search-header">
                <MapPin size={20} className="search-icon" />
                <h3>Can't find your city? Search here</h3>
              </div>
              <button 
                onClick={() => setShowAllCities(true)}
                className="search-toggle-btn"
                type="button"
              >
                <Search size={16} />
                Search All Cities
              </button>
            </div>
          </>
        )}

        {showAllCities && (
          <>
            {/* Search Input */}
            <div className="search-input-section">
              <form onSubmit={handleSearchSubmit} className="search-form">
                <div className="search-input-container">
                  <Search size={20} className="search-input-icon" />
                  <input
                    type="text"
                    placeholder="Type your city name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="search-clear"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Search Results */}
            {searchTerm && (
              <div className="search-results">
                {filteredCities.length > 0 ? (
                  <div className="search-results-list">
                    {filteredCities.map((city, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchSelect(city)}
                        className="search-result-item"
                        type="button"
                      >
                        <MapPin size={16} className="result-icon" />
                        <div className="result-info">
                          <span className="result-city">{city.cityName}</span>
                          <span className="result-state">{city.state}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <MapPin size={32} className="no-results-icon" />
                    <p>No cities found matching "{searchTerm}"</p>
                    <p className="no-results-subtitle">
                      Try a different spelling or search term
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Back Button */}
            <div className="back-section">
              <button 
                onClick={() => {
                  setShowAllCities(false);
                  setSearchTerm('');
                }}
                className="back-btn"
                type="button"
              >
                ← Back to Cities
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CityPopup;