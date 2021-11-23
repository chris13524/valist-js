import { RepoMeta } from '@valist/sdk/dist/types';
import React from 'react';
import DownloadLink from './DownloadLink';
import RepoActions from './RepoActions';

interface RepoMetaCardProps {
  releaseMeta: any,
  repoMeta: RepoMeta,
  orgName: string,
  repoName: string
}

const RepoMetaCard = (props: RepoMetaCardProps) => {
  const {
    repoMeta, releaseMeta, orgName, repoName,
  } = props;

  return (
    <div className="rounded-lg bg-white shadow p-6">
      <RepoActions
        orgName={orgName}
        repoName={repoName}
        projectType={repoMeta.projectType}
        showAll={false} />
      {repoMeta.repository
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Repository</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={repoMeta.repository}>{repoMeta.repository}</a>
        </div>
      }

      {repoMeta.homepage
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900  mb-1">Homepage</h1>
          <a className="text-gray-600 hover:text-indigo-500" href={repoMeta.homepage}>{repoMeta.homepage}</a>
        </div>
      }
      {releaseMeta.version
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">Version</h1>
          <div className="text-gray-600">{releaseMeta.version}</div>
        </div>}

      {releaseMeta.license
        && <div className="pb-4">
          <h1 className="text-xl text-gray-900 mb-1">License</h1>
          <div className="text-gray-600">
            {releaseMeta.license}
          </div>
        </div>}
      <div className="pb-4">
        {releaseMeta.artifacts
          && <DownloadLink
              releaseName={
                `${orgName}-${repoName}-${releaseMeta.version ? releaseMeta.version : ''}`
              }
              releaseMeta={releaseMeta}
              />
        }
      </div>
    </div>
  );
};

export default RepoMetaCard;
