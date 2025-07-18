import ImageDetails from "@/components/common/image-details";
import React from "react";

export default function Page({
    params,
}: {
    params: Promise<{ imageID: string }>;
}) {
    const unwrappedParams = React.use(params);
    const { imageID } = unwrappedParams;
    return <ImageDetails imageID={imageID} />;
}
