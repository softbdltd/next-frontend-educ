import {DomainDetailsContext} from "../../../@core/contexts/domain";
import asyncComponent from "../../../@core/utility/asyncComponent";
import InstituteDefaultFrontPage from "../../../@core/layouts/hoc/InstituteDefaultFrontPage";
import {useIntl} from "react-intl";
import {useContext} from "react";
import PageMeta from "../../../@core/core/PageMeta";


const InstituteCertificate = asyncComponent(
  () => import('../../../modules/institute/certificate'),
);

export default InstituteDefaultFrontPage(() => {
  const {messages} = useIntl();
  const details = useContext<any>(DomainDetailsContext);
  return (
    <>
      <PageMeta
        title_prefix={details?.title_prefix}
        title={messages['menu.certificate'] as string}
      />
      <InstituteCertificate />
    </>
  );
});
