import settings from "../domainConfig";

let fullDomain = window.location.hostname;
let domain = fullDomain.replace(/^admin\./, '');
export const localstorage_id = domain
export const userTypeInfo = [
    { "priority": 9, "userType": "owner", "shortname": "OW" },
    { "priority": 8, "userType": "subowner", "shortname": "SOW" },
    { "priority": 7, "userType": "superadmin", "shortname": "SU" },
    { "priority": 6, "userType": "admin", "shortname": "AD" },
    { "priority": 5, "userType": "subadmin", "shortname": "SUA" },
    { "priority": 4, "userType": "master", "shortname": "MA" },
    { "priority": 3, "userType": "superagent", "shortname": "SA" },
    { "priority": 2, "userType": "agent", "shortname": "A" },
    { "priority": 1, "userType": "client", "shortname": "C" },]

export const UserTypeData = {
    owner: { "userType": "owner", "priority": 9, "shortname": "OW" },
    subowner: { "userType": "subowner", "priority": 8, "shortname": "SOW" },
    superadmin: { "userType": "superadmin", "priority": 7, "shortname": "SU" },
    admin: { "userType": "admin", "priority": 6, "shortname": "AD" },
    subadmin: { "userType": "subadmin", "priority": 5, "shortname": "SUA" },
    master: { "userType": "master", "priority": 4, "shortname": "MA" },
    superagent: { "userType": "superagent", "priority": 3, "shortname": "SA" },
    agent: { "userType": "agent", "priority": 2, "shortname": "A" },
    client: { "userType": "client", "priority": 1, "shortname": "C" },
};

export let websiteName = settings?.websiteName
export let socketDomain = settings?.socketDomain
export const encruptedDataFlag = false;
export const decryptedDataFlag = false;
export const matchBetPlaceModal = true;
export let noFancyMatchDetails = settings?.noFancyMatchDetails;

if (settings?.domainName === 'VET69') {
    document.title = settings.title

} else if (settings?.domainName === 'DRX100') {
    document.title = settings.title
} else if (settings?.domainName === 'PLX99') {
    document.title = settings.title
} else if (settings?.domainName === 'PLXWIN') {
    document.title = settings.title
}





export const betChipsValues = {
    "1000": 1000,
    "2000": 2000,
    "5000": 5000,
    "10000": 10000,
    "20000": 20000,
    "50000": 50000,
    "100000": 100000,
    "250000": 250000,
    "100000": 100000,
    "200000": 200000,
    "300000": 300000
};


let user = JSON.parse(localStorage.getItem(`user_id_${localstorage_id}`));
export const CASINOPRICE = {
    PRICE: user && user.data & user.data.intCasinoMultiply ? user.data.intCasinoMultiply : "2",
    AMOUNT: "10",
};
export const DOMAIN = {
    NAME: "tvs99.com",
};