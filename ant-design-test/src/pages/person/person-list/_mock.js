// eslint-disable-next-line import/no-extraneous-dependencies
import { parse } from 'url';
// mock tableListDataSource
let tableListDataSource = [];

function getPerson(req,res,u) {
    let url=u;
    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        // eslint-disable-next-line prefer-destructuring
        url = req.url;
      }
    
      const params = parse(url, true).query;
      let dataSource = tableListDataSource;

      if (params.status) {
        const status = params.status.split(',');
        let filterDataSource = [];
        status.forEach(s => {
          filterDataSource = filterDataSource.concat(
            dataSource.filter(item => {
              if (parseInt(`${item.status}`, 10) === parseInt(s.split('')[0], 10)) {
                return true;
              }
    
              return false;
            }),
          );
        });
        dataSource = filterDataSource;
      }

      if (params.name) {
        dataSource = dataSource.filter(data => data.name.includes(params.name || ''));
      }
      if (params.age) {
        dataSource = dataSource.filter(data => data.age===(params.age));
      }
      if (params.sex) {
        dataSource = dataSource.filter(data => data.sex===(params.sex));
      }


      let pageSize = 10;

      if (params.pageSize) {
        pageSize = parseInt(`${params.pageSize}`, 0);
      }
      const result = {
        data: dataSource,
        total: dataSource.length,
        success: true,
        pageSize,
        current: parseInt(`${params.currentPage}`, 10) || 1,
      };
      return res.json(result);

}

function postPerson(req,res,u,b) {
    let url =u;

    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        // eslint-disable-next-line prefer-destructuring
        url = req.url;
      }
    
      const body = (b && b.body) || req.body;
      const { method, name, age,sex, key } = body;

      switch(method){

        case 'delete':
            tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
            break;
        
        case 'post':
            const i = Math.ceil(Math.random() * 10000);
            tableListDataSource.unshift({
                key:i,
                name,
                age,
                sex,
            });
            break;

        case 'update':
            tableListDataSource = tableListDataSource.map(item => {
                if (item.key === key) {
                  return { ...item, name, age,sex };
                }
        
                return item;
              });
              break;
        default:
            break;
      }

      const result = {
        list: tableListDataSource,
        pagination: {
          total: tableListDataSource.length,
        },
      };
      return res.json(result);
}

export default {
    'GET /api/person':getPerson,
    'POST /api/person':postPerson,
};