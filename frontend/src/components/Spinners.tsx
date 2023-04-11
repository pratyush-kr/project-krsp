import React from "react";

import { ClipLoader, ClockLoader, FadeLoader, PropagateLoader, HashLoader, DotLoader } from "react-spinners";

const PropagateLoading = () => {
    return <PropagateLoader color="#A4508B" size={10} />;
};

const ClockLoading = () => {
    return <ClockLoader size={200} color="white" />;
};

const FadeLoading = () => {
    return <FadeLoader color="#A230ED" />;
};

const ClipLoading = () => {
    return <ClipLoader color="#A4508B" size={80} />;
};

const HashLoading = () => {
    return <HashLoader size={200} color="white" />;
};

const DotLoading = () => {
    return <DotLoader size={200} color="white" />;
};

export { PropagateLoading, ClockLoading, FadeLoading, ClipLoading, HashLoading, DotLoading };
