export async function GET(
    req: Request,
    { params }: { params: Promise<{ userID: number }>}
) {
    const { userID } = await params;
}