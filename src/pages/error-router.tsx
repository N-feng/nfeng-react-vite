import {
  useNavigate,
} from 'react-router-dom';

export const ErrorRouter = () => {
  const navigate = useNavigate();

  return (
      <div>
          <h1>找不到路由地址 </h1>
          <button onClick={() => navigate(-1)}>&larr; Go back</button>
      </div>
  );
};

export default ErrorRouter