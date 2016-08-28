import uuid from 'node-uuid';
import {menu_options} from '../lib/menu';
import url from 'url';

export default function initializeRoutes(app, mission_control) {
  app.get('/', (req, res) => {
      res.sendFile(__dirname + '/build/index.html');
  });

  app.get('/menu_options', (req, res) => {
    console.log('SERVER: received GET request for menu options');
    let url_parts = url.parse(req.url, true);
    res.status(200).send(menu_options);
  });
}
