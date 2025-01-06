import { login, createProject } from '../api/auth';
import { tokenStorage } from '../api/axiosConfig';
import API from '../api/axiosConfig';

const testAllAPIs = async () => {
  try {
    // 1. 로그인 테스트
    console.log('\n1. 로그인 테스트');
    const loginResult = await login('test@example.com', 'Test123!@#');
    console.log('로그인 결과:', loginResult);
    tokenStorage.setToken(loginResult.data.token);

    // 2. 프로젝트 생성 테스트
    console.log('\n2. 프로젝트 생성 테스트');
    const newProject = await createProject({
      name: "테스트 프로젝트",
      description: "API 테스트입니다",
      startDate: "2024-01-07",
      endDate: "2024-02-07"
    });
    console.log('프로젝트 생성 결과:', newProject);

    // 3. 프로젝트 목록 조회 테스트
    console.log('\n3. 프로젝트 목록 조회 테스트');
    const projectList = await API.get('/projects');
    console.log('프로젝트 목록:', projectList.data);

    // 4. 프로젝트 수정 테스트
    console.log('\n4. 프로젝트 수정 테스트');
    const updatedProject = await API.put(`/projects/${newProject.data.id}`, {
      name: "수정된 프로젝트",
      description: "수정된 설명입니다",
      startDate: "2024-01-07",
      endDate: "2024-02-07"
    });
    console.log('프로젝트 수정 결과:', updatedProject.data);

    // 5. 사용자 정보 조회 테스트
    console.log('\n5. 사용자 정보 조회 테스트');
    const userInfo = await API.get('/users/me');
    console.log('사용자 정보:', userInfo.data);

    // 6. 프로젝트 삭제 테스트
    console.log('\n6. 프로젝트 삭제 테스트');
    const deleteResult = await API.delete(`/projects/${newProject.data.id}`);
    console.log('프로젝트 삭제 결과:', deleteResult.data);

  } catch (error) {
    console.error('테스트 실패:', error);
  }
};

testAllAPIs(); 