import { Badge } from "@/components/ui/badge";

export const GetFeedbackStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return <Badge variant="destructive">Pending</Badge>;
        case 2:
            return <Badge variant="secondary">Review</Badge>;
        case 3:
            return <Badge variant="default">Resolved</Badge>;
        default:
            return null;
    }
};
export const GetTreeStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return <Badge variant="default">Active</Badge>;
        case 2:
            return <Badge variant="secondary">Inactive</Badge>;
        case 3:
            return <Badge variant="semiDestructive">Temporary Deleted</Badge>;
        case 4:
            return <Badge variant="destructive">Permanently Deleted</Badge>;
        default:
            return null;
    }
};
export const GetImageStatusBadge = (status: number) => {
    switch (status) {
        case 1:
            return <Badge variant="default">Active</Badge>;
        case 2:
            return <Badge variant="secondary">Inactive</Badge>;
        case 3:
            return <Badge variant="semiDestructive">Temporary Deleted</Badge>;
        case 4:
            return <Badge variant="destructive">Permanently Deleted</Badge>;
        default:
            return null;
    }
};
interface disease {
    likelihoodScore: number;
    diseaseName: string;
}
export const GetImageHeathStatusBadge = (diseases: disease[]) => {
    const isHealthy = diseases?.some(
        (disease) =>
            disease.diseaseName === "Healthy" && disease.likelihoodScore > 30
    );
    return isHealthy ? (
            <Badge variant="default" className="whitespace-nowrap">
                {diseases?.find((disease) => disease.diseaseName === "Healthy")
                    ?.likelihoodScore || 0}
                % Healthy
            </Badge>
        ) : (
        <Badge variant="destructive">
            {diseases
                .filter((di) => di.diseaseName !== "Healthy")
                .reduce((acc, disease) => acc + disease.likelihoodScore, 0)
                .toFixed(1) + "% Diseased"}
        </Badge>
    );
};
export const getUserStatus = (status: number) => {
    switch (status) {
        case 1:
            return <Badge variant="default">Active</Badge>;
        case 2:
            return <Badge variant="secondary">Inactive</Badge>;
        case 3:
            return <Badge variant="semiDestructive">Deactivated</Badge>;
        case 4:
            return <Badge variant="destructive">Deleted</Badge>;
        default:
            return null;
    }
};
