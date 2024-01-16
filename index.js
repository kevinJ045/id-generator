const express = require('express');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

/**
 * 
 * @param {string} value 
 * @returns {string | any[] | false}
 */
function parseValue(value){
    if(!isNaN(parseFloat(value))) return parseFloat(value);
    if(!isNaN(parseInt(value))) return parseInt(value);
    if(value.startsWith('[') && value.endsWith(']')){
        return [
            ...value.replace(/^\[|\]$/g, '').split(',')
        ]
    }
    if(value == "false") return false;
    return value;
}

app.get('/id', (req, res) => {
    const data = {
        avatar: 'https://github.com/kevinj045.png',
        // background: 'background_url',
        fields: {
            
        },
        title: 'Employee ID Card',
        footer: 'Company Name',
        card: {
            background: [255, 255, 255],
            background_opacity: 1,
            border_radius: '10px',
            avatar_background: [221, 221, 221],
            avatar_background_opacity: 1,
            effects: ['blur'],
            padding: 0
        },
        links: {
            top_icon_width: 24,
            top_icon_heigh: 24,
            bottom_icon_width: 24,
            bottom_icon_heigh: 24,
            top_link_new_tab: true,
            bottom_link_new_tab: true,
        },
        options: {
            display_first: true
        }
    };

    const query = {};
    for(let i in req.query){
        if(i.indexOf('.') > -1){
            let [parent, key] = i.split('.');
            if(!query[parent]) query[parent] = {};
            query[parent][key] = req.query[i];
        } else {
            query[i] = req.query[i];
        }
    }

    for(let i in query){
        if(typeof data[i] == 'object'){
            for(let j in query[i]){
                data[i][j] = parseValue(query[i][j]);
            }
        } else {
            data[i] = parseValue(query[i]);
        }
    }

    const background = data.background ? `url(${data.background})` : 'linear-gradient(#09d0d0, #ef1243)';

    res.render('idCard', { data, background });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
