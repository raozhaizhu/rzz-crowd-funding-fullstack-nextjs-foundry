export type VerifyAddressComplianceRequestBody = {
  // 用户地址
  address: string;
  // 幂等键
  idempotencyKey: string;
};

/**
 * @notice 此方法用于检测请求是否合规
 * @dev 使用 circleApi 进行合规性检查
 * @param Request 内含用户 address，idempotencyKey
 */

export const POST = async (request: Request) => {
  try {
    // 获取地址和幂等键，不存在就报错
    const { address, idempotencyKey } =
      (await request.json()) as VerifyAddressComplianceRequestBody;
    if (!address || !idempotencyKey)
      return Response.json({
        error: "Address and idempotencyKey is required",
        success: false,
      });
    // 定义链
    const chain = "ETH-SEPOLIA";

    // 定义 circleApi，不存在就报错
    const circleApiKey = process.env.CIRCLE_API_KEY;
    if (!circleApiKey)
      return Response.json({ error: "ApiKey is required", success: false });

    // 检查是否开启合规性检测，如果不开启，直接放行
    const complianceEnabled = process.env.ENABLE_COMPLIANCE_CHECK;
    if (!complianceEnabled)
      return Response.json({
        success: true,
        isApproved: true,
        data: {
          result: "APPROVED",
          message: "Compliance check is disabled",
        },
      });

    // 向 circleApi 请求，进行合规性检查,并获取答复数据
    const circleResponse = await fetch(
      "https:api.circle.com/v1/w3s/compliance/screening/addresses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${circleApiKey}`,
        },
        body: JSON.stringify({
          idempotencyKey,
          address,
          chain: chain,
        }),
      }
    );
    const data = await circleResponse.json();

    // 获取审批结果，并加入答复中 （仅当请求结果为批准时，才予以放行）
    const isApproved = data?.data?.result === "APPROVED";
    return Response.json({
      success: true,
      isApproved,
      data: data?.data,
    });
  } catch (error) {
    // 若出现服务端错误，打印并答复错误
    console.log("*** error:", error, "***");
    return Response.json({
      error: "Internal server error",
      status: 500,
      success: false,
    });
  }
};
