import { useState, useCallback, useMemo } from 'react';
import { ProjectData } from 'shared/project.types';

function composeKey(project: ProjectData | null, key: string): string {
  return `${project?.path || '__noproject'}:${key}`;
}

function useInferredDefaultProjectBuildPath(project: ProjectData | null): string {
  const { path } = project || {};

  return useMemo(() => {
    if (!path) {
      return '';
    }

    const [projectDirName, ...parts] = path.split(/[\\/]/).reverse();

    return parts.reverse().join('\\') + '\\' + `${projectDirName}-build`;
  }, [path]);
}

export function getProjectClientStorageItem<ValueType>(project: ProjectData | null, key: string, defaultValue: ValueType): ValueType {
  const composedKey = composeKey(project, key);

  if (window.localStorage[composedKey]) {
    return JSON.parse(window.localStorage[composedKey]);
  }

  return defaultValue;
}

export function useProjectClientStorageItem<ValueType>(project: ProjectData | null, key: string, defaultValue: ValueType): [ValueType, (newValue: ValueType) => void] {
  const initialValue = useMemo(() => getProjectClientStorageItem(project, key, defaultValue), [project?.path, key]);

  const [value, setValue] = useState(initialValue);
  const composedKey = useMemo(() => composeKey(project, key), [project?.path, key]);

  const handleSetValue = useCallback((newValue: ValueType) => {
    window.localStorage[composedKey] = JSON.stringify(newValue);
    setValue(newValue);
  }, [setValue, composedKey]);

  return [value, handleSetValue];
}

export const getProjectBuildPathVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'buildPath', '');
export const useProjectBuildPathVar = (project: ProjectData | null) => {
  return useProjectClientStorageItem(project, 'buildPath', useInferredDefaultProjectBuildPath(project));
}

export const getProjectUseVersioningVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'useVersioning', true);
export const useProjectUseVersioningVar = (project: ProjectData | null) => useProjectClientStorageItem(project, 'useVersioning', true);

export const getProjectDeployArtifactVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'deployArtifact', true);
export const useProjectDeployArtifactVar = (project: ProjectData | null) => useProjectClientStorageItem(project, 'deployArtifact', true);

export const getProjectUseTxAdminVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'useTxAdmin', true);
export const useProjectUseTxAdminVar = (project: ProjectData | null) => useProjectClientStorageItem(project, 'useTxAdmin', true);

export const getProjectSteamWebApiKeyVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'steamWebApiKey', '');
export const useProjectSteamWebApiKeyVar = (project: ProjectData | null) => useProjectClientStorageItem(project, 'steamWebApiKey', '');

export const getProjectTebexSecretVar = (project: ProjectData | null) => getProjectClientStorageItem(project, 'tebexSecret', '');
export const useProjectTebexSecretVar = (project: ProjectData | null) => useProjectClientStorageItem(project, 'tebexSecret', '');
