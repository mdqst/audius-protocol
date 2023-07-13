import knex, { Knex } from "knex"
import { appNotificationsSql } from "."
import moment from "moment"
import { EmailNotification } from "../../types/notifications"

const oldQuery = async (dnDb: Knex, userIds: string[], startOffset: moment.Moment): Promise<EmailNotification[]> => {
    const { rows } = await dnDb.raw(`
    WITH latest_user_seen AS (
        SELECT DISTINCT ON (user_id)
          user_id,
          seen_at
        FROM
          notification_seen
        WHERE
          user_id = ANY(:user_ids)
        ORDER BY
          user_id,
          seen_at desc
      )
      SELECT
        n.*,
        unnest(n.user_ids) AS receiver_user_id
      FROM (
        SELECT *
        FROM notification
        WHERE
          notification.timestamp > :start_offset AND
          notification.user_ids && (:user_ids)
      ) AS n
    `, {
        start_offset: startOffset,
        user_ids: [[userIds]]
      })
      console.log({ rows })
      return []
}

const newQuery = async (dnDb: Knex, userIds: string[], startOffset: moment.Moment): Promise<EmailNotification[]> => {
    return []
}

export const main = async () => {
    const dnDb = knex({
        client: "pg",
        connection: ""
    })

    let userIds = ["1","2","5","6","8","14","25","28","31","34","35","37","43","44","45","48","57","60","64","65","66","68","75","78","80","81","84","86","88","89","90","91","94","97","102","103","104","110","111","112","113","115","116","117","118","121","122","123","124","125","126","127","128","131","132","133","136","142","143","144","145","146","147","148","151","152","153","157","159","160","161","162","165","168","170","171","173","175","176","178","179","180","182","183","191","192","196","197","199","201","202","203","204","205","206","207","208","211","223","226","231","235","236","237","238","239","240","241","242","243","245","249","252","254","255","256","257","260","262","267","270","275","278","279","280","281","283","284","285","286","287","288","290","291","293","295","296","299","301","302","307","311","312","314","321","323","325","328","329","331","332","333","336","337","338","339","342","343","344","346","348","349","356","358","359","361","362","363","365","366","368","369","372","376","377","378","379","380","382","384","386","389","390","391","392","393","395","396","398","399","401","402","403","406","407","410","411","413","416","417","418","420","421","426","427","430","431","432","433","434","435","436","439","440","445","447","448","449","450","451","452","453","454","455","456","457","469","472","474","480","481","488","489","490","500","507","508","509","511","512","514","515","516","517","522","523","525","526","529","530","536","537","540","541","546","547","548","549","550","554","559","561","562","566","567","569","572","574","575","577","581","582","583","584","588","591","593","595","599","601","602","603","607","608","610","612","616","617","618","622","623","636","637","642","644","651","652","653","655","656","658","661","664","668","669","670","673","674","679","683","684","685","686","689","691","693","694","697","698","700","706","710","714","715","717","719","720","724","725","726","728","729","732","733","735","736","738","742","743","744","745","746","750","755","757","759","760","761","764","769","771","772","774","778","780","781","782","784","787","790","791","792","793","794","797","798","799","800","801","803","805","808","813","815","817","822","824","825","826","827","828","831","833","834","835","840","841","842","844","847","849","854","855","856","859","860","861","863","868","869","870","872","873","874","875","877","878","880","881","882","883","885","886","887","891","893","895","897","899","900","901","902","903","904","906","908","909","910","913","915","916","917","918","922","924","925","928","931","933","934","937","940","943","944","945","947","950","952","953","954","957","959","962","964","965","966","968","969","970","971","973","974","976","977","978","980","982","983","984","985","986","988","989","993","995","996","998","1000","1003","1004","1005","1006","1007","1009","1010","1011","1014","1019","1020","1022","1028","1029","1030","1032","1033","1036","1037","1040","1041","1044","1047","1050","1051","1052","1054","1058","1063","1064","1065","1068","1070","1072","1076","1078","1079","1082","1083","1088","1090","1091","1096","1098","1099","1104","1106","1108","1112","1113","1114","1115","1116","1117","1119","1123","1129","1130","1131","1132","1133","1135","1136","1137","1139","1140","1142","1143","1144","1145","1147","1148","1151","1157","1160","1163","1164","1165","1166","1168","1171","1174","1176","1178","1181","1186","1187","1189","1190","1192","1194","1195","1197","1199","1200","1201","1203","1204","1205","1211","1214","1216","1217","1218","1220","1223","1225","1229","1230","1231","1234","1235","1241","1243","1244","1246","1248","1249","1250","1251","1253","1256","1257","1260","1262","1264","1265","1266","1270","1272","1273","1275","1276","1277","1279","1280","1282","1287","1289","1292","1294","1295","1296","1297","1299","1300","1302","1303","1307","1310","1311","1312","1314","1320","1321","1323","1324","1326","1327","1329","1331","1332","1333","1334","1337","1341","1342","1343","1344","1346","1348","1353","1358","1359","1361","1362","1367","1368","1370","1371","1372","1374","1376","1377","1379","1380","1381","1382","1384","1388","1394","1397","1399","1401","1403","1404","1406","1407","1408","1410","1411","1412","1413","1414","1418","1419","1420","1421","1422","1425","1426","1427","1428","1429","1430","1432","1433","1434","1435","1438","1442","1443","1444","1445","1448","1450","1454","1455","1456","1457","1459","1460","1461","1462","1463","1465","1466","1467","1468","1469","1470","1472","1474","1475","1483","1484","1488","1489","1492","1495","1496","1497","1498","1500","1504","1508","1511","1512","1513","1514","1517","1521","1523","1524","1528","1529","1535","1536","1537","1539","1541","1542","1543","1548","1550","1552","1554","1555","1556","1559","1560","1561","1563","1566","1567","1569","1573","1574","1575","1576","1577","1584","1596","1600","1601","1606","1607","1615","1621","1628","1630","1633","1636","1637","1638","1642","1643","1649","1650","1653","1656","1660","1661","1664","1666","1667","1669","1671","1674","1678","1679","1683","1689","1695","1696","1701","1705","1707","1709","1715","1722","1723","1725","1726","1728","1729","1731","1732","1735","1738","1740","1741","1742","1743","1746","1749","1751","1752","1754","1755","1757","1759","1760","1762","1766","1767","1768","1769","1770","1771","1773","1775","1777","1778","1782","1786","1787","1790","1792","1795","1800","1801","1803","1812","1814","1815","1817","1820","1821","1825","1827","1829","1830","1833","1834","1835","1843","1844","1846","1853","1854","1855","1856","1857","1862","1863","1865","1869","1870","1878","1880","1882","1885","1888","1889","1894","1897","1898","1899","1900","1904","1916","1918","1919","1920","1921","1923","1925","1926","1927","1928","1932","1933","1934","1939","1941","1946","1947","1948","1950","1951","1953","1954","1957","1959","1963","1965","1967","1968","1970","1971","1972","1980","1982","1983","1984","1985","1987","1989","1990","1991","1992","1994","1996","1997","2003","2008","2012","2017","2026","2029","2030","2032","2038","2039","2043","2045","2051","2053","2056","2057","2066","2068","2070","2074","2075","2077","2078","2080","2082","2083","2084","2085","2090","2092","2095","2097","2099","2100","2104","2105","2107","2110","2111","2114","2116","2120","2121","2124","2126","2127","2129","2130","2131","2138","2146","2148","2152","2154","2160","2161","2170","2180","2182","2185","2187","2197","2200","2208","2210","2212","2214"]
    userIds = userIds.slice(0, 10)
    const now = moment.utc()
    let days = 1 // 7
    const startOffset = now.clone().subtract(days, 'days')

    console.log("starting old query")
    const oldResults = await oldQuery(dnDb, userIds, startOffset)
    console.log({ oldResults })
    process.exit(0)
}

main().catch(console.error)
