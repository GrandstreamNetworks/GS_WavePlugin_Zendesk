import { ConfigBlock, ConnectError, ConnectState, Footer } from "@/components";
import { GlobalModelState, connect, useIntl } from "umi";
import styles from "./index.less";
import React from "react";

interface Props {
    userConfig?: any;
}

const HomePage: React.FC<Props> = ({ userConfig }) => {

    const { formatMessage } = useIntl();

    return (
        <>
            <ConnectError />
            <div className={styles.homePage}>
                <ConnectState />
                <ConfigBlock />
            </div>
            <Footer url={`https://app.futuresimple.com/dashboards/main`}
                userConfig={userConfig}
                message={formatMessage({ id: "home.toCRM" })} />
        </>
    );
};

export default connect(({ global }: { global: GlobalModelState }) => ({
    userConfig: global.userConfig,
}))(HomePage);;
