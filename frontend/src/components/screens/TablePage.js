import React, { useEffect, useState } from 'react';
import './TablePage.css';
import { FiExternalLink } from 'react-icons/fi';


const calculateRange = (data, rowsPerPage) => {
  const range = [];
  const num = Math.ceil(data.length / rowsPerPage);
  let i = 1;
  for (let i = 1; i <= num; i++) {
    range.push(i);
  }
  return range;
};

const sliceData = (data, page, rowsPerPage) => {
  return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
};

const TableFooter = ({ range, setPage, page, slice }) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <div className="tableFooter">
      {range.map((el, index) => (
        <button
          key={index}
          className={'table-button '+ (page === el ? 'activeButton' : 'inactiveButton')}
          onClick={() => setPage(el)}
        >
          {el}
        </button>
      ))}
    </div>
  );
};

const useTable = (data, page, rowsPerPage) => {
  const [tableRange, setTableRange] = useState([]);
  const [slice, setSlice] = useState([]);

  useEffect(() => {
    const range = calculateRange(data, rowsPerPage);
    setTableRange([...range]);

    const slice = sliceData(data, page, rowsPerPage);
    setSlice([...slice]);
  }, [data, setTableRange, page, setSlice]);

  return { slice, range: tableRange };
};

const Table = ({ data, rowsPerPage }) => {
  const [page, setPage] = useState(1);
  const { slice, range } = useTable(data, page, rowsPerPage);
  return (
    <div className='animal-table-div'>
      <table className="animal-table">
        <thead className="tableRowHeader">
          <tr>
            <th className="tableHeader">Common Name</th>
            <th className="tableHeader">Location</th>
            <th className="tableHeader">Threat</th>
            <th className="tableHeader">Explore</th>
          </tr>
        </thead>
        <tbody className='tableBody'>
          {slice.map((el, index) => (
            <tr className="tableRowItems" key={index}>
              <td className="tableCell">{el.name}</td>
              <td className="tableCell">{el.location}</td>
              <td className="tableCell">{el.threat}</td>
              <td className="tableCell"><a href={el.explore} target="_blank"><FiExternalLink color='#ffc107'/></a></td>
            </tr>
          ))}
        </tbody>
      </table>
      <TableFooter range={range} slice={slice} setPage={setPage} page={page} />
    </div>
  );
};


function TablePage(){
  // const items=props.items;
  // console.log(items);

  const [animas, setAnimals] = useState([]);
  useEffect(() => {
    fetch('/animals',{
        method:"get",
        headers:{
          "Authorization":"Bearer "+localStorage.getItem("jwt"),
        }
      }).then(res=>res.json()).then(response=>{
        let data = [];
            response.forEach((animal) => {
            let name = animal['Common Name'];
            let location = animal['Distribution'].split(':')[0];
            let threat = animal['Endangered Species Act Status'];
            let explore = animal['View on NatureServe Explorer'];
            data.push({name: name, location: location, threat: threat, explore: explore});
        });
        setAnimals(data);
      });
  }, []);

  return (

    <div className='section-div'>
      <section>
      <main className="table-container">
        <div className="table-wrapper ">
          <Table data={animas} rowsPerPage={10} />
        </div>
      </main>
        {/* <Table data={props.items} rowsPerPage={10} /> */}
      </section>
    </div>
  );



};

export default TablePage;