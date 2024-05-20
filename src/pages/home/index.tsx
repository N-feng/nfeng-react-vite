import { PageContainer } from '@ant-design/pro-components';
import { trim } from '../../utils/format';
import Guide from '../../components/guide/Guide';

const HomePage: React.FC = () => {
  return (
    <PageContainer ghost>
      <div>
        <Guide name={trim(' cra ')} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
