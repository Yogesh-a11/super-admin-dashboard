import Company from "../models/companyModel.js";
import util from "util";

export const getDashboardData = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    const matchStage = status ? { status } : {};
    // console.log(matchStage)

    const [result] = await Company.aggregate([
      {
        $facet: {
          totalCompanies: [
            { $count: "count" }
          ],

          activeCompanies: [
            { $match: { status: "active" } },
            { $count: "count" }
          ],

          trials: [
            {
              $match: {
                "subscription.isTrial": true,
                "subscription.trialEndsAt": { $gte: new Date() }
              }
            },
            { $count: "count" }
          ],

          monthlyRevenue: [
            {
              $match: {
                "subscription.isActive": true
              }
            },
            {
              $group: {
                _id: null,
                total: { $sum: "$subscription.price" }
              }
            }
          ],

          companies: [
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * pageLimit },
            { $limit: pageLimit },
            {
              $project: {
                name: 1,
                admin: 1,
                status: 1,
                employeesCount: 1,
                createdAt: 1
              }
            }
          ],

          totalCompaniesForPagination: [
            { $match: matchStage },
            { $count: "count" }
          ]
        }
      }
    ]);
    console.log(
  util.inspect(result, {
    depth: null,
    colors: true
  })
);

    res.status(200).json({
      stats: {
        totalCompanies: result.totalCompanies[0]?.count || 0,
        activeCompanies: result.activeCompanies[0]?.count || 0,
        trials: result.trials[0]?.count || 0,
        monthlyRevenue: result.monthlyRevenue[0]?.total || 0
      },
      companies: result.companies,
      pagination: {
        total: result.totalCompaniesForPagination[0]?.count || 0,
        page: pageNumber,
        limit: pageLimit
      }
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
};

