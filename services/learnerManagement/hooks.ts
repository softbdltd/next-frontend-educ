import {API_SKILLS,} from '../../@core/common/apiRoutes';
import {useAxiosSWR, useDataLocalizationAxiosSWR,} from '../../@core/hooks/useAxiosSWR';

export function useFetchSkill(skillId: number | null) {
  return useAxiosSWR(skillId ? API_SKILLS + '/' + skillId : null);
}

export function useFetchLocalizedSkills(params: any) {
  return useDataLocalizationAxiosSWR([API_SKILLS, params]);
}

export function useFetchPublicSkills(params: any) {
  return useDataLocalizationAxiosSWR([API_SKILLS, params]);
}
