import React, { useState, useEffect } from 'react';
import { get } from 'lodash';
import { isEmail, isInt, isFloat } from 'validator';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { FaUserCircle, FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import { Container } from '../../styles/GlobalStyles';
import { Form, ProfilePicture, Title } from './styled';
import Loading from '../../components/Loading';

import * as actions from '../../store/modules/auth/actions';

import axios from '../../services/axios';
import history from '../../services/history';

export default function Student({ match }) {
  const dispatch = useDispatch();
  const id = get(match, 'params.id', '');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    async function getData() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`/students/${id}`);
        const Photo = get(data, 'Photos[0].url', '');
        setPhoto(Photo);

        setFirstName(data.first_name);
        setLastName(data.last_name);
        setEmail(data.email);
        setAge(data.age);
        setWeight(data.weight);
        setHeight(data.height);

        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        const status = get(err, 'response.status', 0);
        const errors = get(err, 'response.data.errors', []);

        if (status === 400) errors.map((error) => toast.error(error));
        history.push('/');
      }
    }

    getData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = false;

    if (firstName.length < 3 || firstName.length > 255) {
      toast.error('First name must be between 3-255 characters');
      formErrors = true;
    }

    if (lastName.length < 3 || lastName.length > 255) {
      toast.error('Last name must be between 3-255 characters');
      formErrors = true;
    }

    if (!isEmail(email)) {
      toast.error('Invalid email');
      formErrors = true;
    }

    if (!isInt(String(age))) {
      toast.error('Age must be an integer');
      formErrors = true;
    }

    if (!isFloat(String(weight))) {
      toast.error('Weight must be an integer or float');
      formErrors = true;
    }

    if (!isFloat(String(height))) {
      toast.error('Height must be an integer or float');
      formErrors = true;
    }

    if (formErrors) return;

    try {
      setIsLoading(true);

      if (id) {
        await axios.put(`/students/${id}`, {
          first_name: firstName,
          last_name: lastName,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student successfully edited');
        // history.push('/');
      } else {
        const { data } = await axios.post(`/students/`, {
          first_name: firstName,
          last_name: lastName,
          email,
          age,
          weight,
          height,
        });
        toast.success('Student successfully created');
        history.push(`/student/${data.id}/edit`);
        // history.push('/');
      }

      setIsLoading(false);
    } catch (err) {
      const status = get(err, 'response.status', 0);
      const data = get(err, 'response.data', {});
      const errors = get(data, 'errors', []);

      if (errors.length > 0) {
        errors.map((error) => toast.error(error));
      } else {
        toast.error('unknown error');
      }

      if (status === 401) dispatch(actions.loginFailure());
    }
  };

  return (
    <Container>
      <Loading isLoading={isLoading} />

      <Title>{id ? 'Edit a student' : 'Create a new student'}</Title>

      {id && (
        <ProfilePicture>
          {photo ? (
            <img src={photo} alt={firstName} />
          ) : (
            <FaUserCircle size={180} />
          )}

          <Link to={`/photos/${id}`}>
            <FaEdit size={24} />
          </Link>
        </ProfilePicture>
      )}

      <Form onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
        />
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
        />
        <input
          type="text"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Weight"
        />
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder="Height"
        />

        <button type="submit">{id ? 'Save' : 'Create a new student'}</button>
      </Form>
    </Container>
  );
}

Student.propTypes = {
  match: PropTypes.shape({}).isRequired,
};
