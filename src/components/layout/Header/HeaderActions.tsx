import { DetailHeaderActions } from './DetailHeaderActions';
import { EditHeaderActions } from './EditHeaderActions';
import type { HeaderActionsProps } from './HeaderActions.types';
import { MainHeaderActions } from './MainHeaderActions';
import { ProfileEditHeaderActions, ProfileViewHeaderActions } from './ProfileHeaderActions';

export const HeaderActions = ({ type, ...props }: HeaderActionsProps) => {
  switch (type) {
    case 'main':
      return <MainHeaderActions onWriteClick={props.onWriteClick} />;
    case 'detail':
      return <DetailHeaderActions {...props} />;
    case 'edit':
      return <EditHeaderActions {...props} />;
    case 'profileView':
      return <ProfileViewHeaderActions {...props} />;
    case 'profileEdit':
      return <ProfileEditHeaderActions {...props} />;
    case 'plain':
    default:
      return null;
  }
};
