import moment from 'moment'
import TimeRange from 'models/TimeRange'

// eslint-disable-next-line
var _0xf6ab=["\x57\x45\x45\x4B","\x4D\x4F\x4E\x54\x48","\x59\x45\x41\x52","\x74\x72\x61\x63\x6B\x5F\x6F\x77\x6E\x65\x72\x5F\x66\x6F\x6C\x6C\x6F\x77\x65\x72\x5F\x63\x6F\x75\x6E\x74","\x6C\x69\x73\x74\x65\x6E\x73","\x77\x69\x6E\x64\x6F\x77\x65\x64\x5F\x72\x65\x70\x6F\x73\x74\x5F\x63\x6F\x75\x6E\x74","\x77\x69\x6E\x64\x6F\x77\x65\x64\x5F\x73\x61\x76\x65\x5F\x63\x6F\x75\x6E\x74","\x72\x65\x70\x6F\x73\x74\x5F\x63\x6F\x75\x6E\x74","\x73\x61\x76\x65\x5F\x63\x6F\x75\x6E\x74","\x63\x72\x65\x61\x74\x65\x64\x5F\x61\x74","\x64\x61\x79\x73","\x64\x69\x66\x66","\x70\x6F\x77","\x6D\x61\x78","\x74\x72\x61\x63\x6B\x5F\x69\x64"];const LM=1;const WRM=50;const WSM=1;const ATRM=0.25;const ATSM=0.01;const CAM=5.0;const TRM={[TimeRange[_0xf6ab[0]]]:7,[TimeRange[_0xf6ab[1]]]:30,[TimeRange[_0xf6ab[2]]]:365};const now=moment();export const getTrendingScore=(_0xb6e0xa,_0xb6e0xb)=>{if(_0xb6e0xa[_0xf6ab[3]]< 3){return 0};const _0xb6e0xc=LM* _0xb6e0xa[_0xf6ab[4]]+ WRM* _0xb6e0xa[_0xf6ab[5]]+ WSM* _0xb6e0xa[_0xf6ab[6]]+ ATRM* _0xb6e0xa[_0xf6ab[7]]+ ATSM* _0xb6e0xa[_0xf6ab[8]];const _0xb6e0xd=moment(_0xb6e0xa[_0xf6ab[9]]);const _0xb6e0xe=now[_0xf6ab[11]](_0xb6e0xd,_0xf6ab[10]);let _0xb6e0xf;if(_0xb6e0xe< TRM[_0xb6e0xb]){_0xb6e0xf= 1}else {_0xb6e0xf= Math[_0xf6ab[13]](1.0/ CAM,Math[_0xf6ab[12]](CAM,1- _0xb6e0xe/ TRM[_0xb6e0xb]))};return _0xb6e0xc* _0xb6e0xf};export const sortByTrendingScore=(_0xb6e0xb)=>(_0xb6e0x11,_0xb6e0x12)=>{const _0xb6e0x13=getTrendingScore(_0xb6e0x11,_0xb6e0xb);const _0xb6e0x14=getTrendingScore(_0xb6e0x12,_0xb6e0xb);if(_0xb6e0x13=== _0xb6e0x14){return _0xb6e0x12[_0xf6ab[14]]- _0xb6e0x11[_0xf6ab[14]]};return _0xb6e0x14- _0xb6e0x13}