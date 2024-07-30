
import axios from "axios";
// const APIURL = 'https://api.optigoapps.com/storev26/store.aspx';
// const APIURL = 'http://zen/api/ReactStore.aspx'
// const APIURL = (window.location.hostname === 'localhost' || window.location.hostname === 'zen') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/storev26/ReactStore.aspx';
const APIURL = (window.location.hostname === 'localhost'
    || window.location.hostname === 'zen'
    || window.location.hostname === 'fgstore.web'
    || window.location.hostname === 'fgstore.mapp'
    || window.location.hostname === 'fgstore.pro'
    || window.location.hostname === 'fgstore.plw'
    || window.location.hostname === 'elvee.web'
    || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/ReactStore/ReactStore.aspx';
    // || window.location.hostname === 'hoq.web') ? 'http://zen/api/ReactStore.aspx' : 'https://api.optigoapps.com/test/ReactStore.aspx';

// const APIURL = 'https://api.optigoapps.com/test/store.aspx';
// const NEWAPIURL = 'https://api.optigoapps.com/storev26/ReactStore.aspx';
// const ZENURL = 'http://zen/api/store.aspx'


export const CommonAPI = async (body) => {
    const storeInit = JSON.parse(localStorage.getItem('storeInit'));
    try {
        const { YearCode, version, token , sv } = storeInit;

        const header = {
            Authorization: `Bearer ${token}`,
            Yearcode: YearCode,
            Version: version,
            sp: "1",
            sv: sv
        };
        const response = await axios.post(APIURL, body, { headers: header });
        return response?.data;

    } catch (error) {
        console.error('error is..', error);
    }
};

