import { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

export const EmployeeContext = createContext();

const EmployeeContextProvider = (props) => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('./employees.json')
      .then(response => {
        const loadedEmployees = response.data.employees.map(employee => ({
          id: employee.id,
          name: employee.name,
          email: employee.email,
          address: employee.address,
          phone: employee.phone
        }));
        setEmployees(loadedEmployees);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const addEmployee = (name, email, address, phone) => {
    const newEmployee = { id: uuidv4(), name, email, address, phone };
    setEmployees([...employees, newEmployee]);
    axios.post('/employees.json', newEmployee)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const deleteEmployee = (id) => {
    setEmployees(employees.filter((employee) => employee.id !== id));
    axios.delete(`/employees.json/${id}`)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };
  
  const updateEmployee = (id, updatedEmployee) => {
    setEmployees(employees.map((employee) => (employee.id === id ? updatedEmployee : employee)));
    axios.put(`/employees.json/${id}`, updatedEmployee)
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, deleteEmployee, updateEmployee }}>
      {props.children}
    </EmployeeContext.Provider>
  );
};

export default EmployeeContextProvider;
