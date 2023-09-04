using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models;
using Sabio.Models.Domain;
using Sabio.Models.Domain.Grades;
using Sabio.Models.Requests.Grades;
using Sabio.Models.Requests.ReplayEntries;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class GradeService : IGradeService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        ILookUpService _lookUpService = null;

        public GradeService(IDataProvider data, IBaseUserMapper userMapper, ILookUpService lookUpService)
        {
            _data = data;
            _userMapper = userMapper;
            _lookUpService = lookUpService;
        }

        public int AddGrade(GradeAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Grades_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOutput = new SqlParameter("@Id", SqlDbType.Int);
                idOutput.Direction = ParameterDirection.Output;

                col.Add(idOutput);

            },
            returnParameters: delegate (SqlParameterCollection returnedCol)
            {
                object newId = returnedCol["@Id"].Value;

                int.TryParse(newId.ToString(), out id);
            });
            return id;
        }

        public List<int> AddBatchReplayGrade(List<ReplayEntryGradeAddRequest> model, int userId)
        {
            DataTable myUdtTable = null;
            List<int> ids = null;
            string procName = "[dbo].[ReplayGrades_BatchInsert]";

            if (model != null)
            {
                myUdtTable = BatchReplayGrades(model);
            }
            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@BatchReplayEntryGrades", myUdtTable);
                col.AddWithValue("@CreatedBy", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int id = new int();
                int startingIndex = 0;

                id = reader.GetInt32(startingIndex++);

                if (ids == null)
                {
                    ids = new List<int>();
                }
                ids.Add(id);
            });
            return ids;
        }
        public List<int> BatchInsertGrades(List<GradeAddRequest> model, int userId)
        {
            DataTable myUdtTable = null;
            List<int> ids = null;
            string procName = "[dbo].[Grades_BatchInsert]";

            if (model != null)
            {
                myUdtTable = InsertUdtModel(model);
            }

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@BatchInsertGrades", myUdtTable);
                col.AddWithValue("@CreatedBy", userId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int id = new int();
                int startingIndex = 0;

                id = reader.GetInt32(startingIndex++);

                if (ids == null)
                {
                    ids = new List<int>();
                }
                ids.Add(id);
            });
            return ids;
        }
        private DataTable BatchReplayGrades(List<ReplayEntryGradeAddRequest> model)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("ReplayEntryId", typeof(int));
            dt.Columns.Add("GradeTypeId", typeof(int));
            dt.Columns.Add("Comment", typeof(string));

            if (model != null)
            {
                foreach (ReplayEntryGradeAddRequest singleGrade in model)
                {
                    DataRow dataRow = dt.NewRow();
                    int startingIndex = 0;

                    dataRow.SetField(startingIndex++, singleGrade.ReplayEntryId);
                    dataRow.SetField(startingIndex++, singleGrade.GradeTypeId);
                    dataRow.SetField(startingIndex++, singleGrade.Comment);

                    dt.Rows.Add(dataRow);
                }
            }
            return dt;
        }
        private DataTable InsertUdtModel(List<GradeAddRequest> model)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("FoulId", typeof(int));
            dt.Columns.Add("GradeTypeId", typeof(int));
            dt.Columns.Add("Comment", typeof(string));

            if (model != null)
            {
                foreach (GradeAddRequest singleGrade in model)
                {
                    DataRow dataRow = dt.NewRow();
                    int startingIndex = 0;

                    dataRow.SetField(startingIndex++, singleGrade.FoulId);
                    dataRow.SetField(startingIndex++, singleGrade.GradeTypeId);
                    dataRow.SetField(startingIndex++, singleGrade.Comment);

                    dt.Rows.Add(dataRow);
                }
            }

            return dt;
        }
        public void BatchUpdateReplayGrades(List<ReplayEntryGradeUpdateRequest> model, int userId)
        {
            string procName = "[dbo].[ReplayGrades_BatchUpdate]";
            DataTable myUdtTable = null;

            if (model != null)
            {
                myUdtTable = UpdateReplayUdtModel(model);
            }

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@BatchReplayEntryGrades", myUdtTable);
                col.AddWithValue("@ModifiedBy", userId);
            },
            returnParameters: null);
        }
        public void BatchUpdateGrades(List<GradeUpdateRequest> model, int userId)
        {
            string procName = "[dbo].[Grades_BatchUpdate]";
            DataTable myUdtTable = null;

            if (model != null)
            {
                myUdtTable = UpdateUdtModel(model);
            }

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@BatchUpdateGrades", myUdtTable);
                col.AddWithValue("@ModifiedBy", userId);
            },
            returnParameters: null);
        }
        private DataTable UpdateReplayUdtModel(List<ReplayEntryGradeUpdateRequest> model)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("ReplayEntryId", typeof(int));
            dt.Columns.Add("GradeTypeId", typeof(int));
            dt.Columns.Add("Comment", typeof(string));
            dt.Columns.Add("StatusId", typeof(int));
            dt.Columns.Add("Id", typeof(int));

            if (model != null)
            {
                foreach (ReplayEntryGradeUpdateRequest singleGrade in model)
                {
                    DataRow dataRow = dt.NewRow();
                    int startingIndex = 0;

                    dataRow.SetField(startingIndex++, singleGrade.ReplayEntryId);
                    dataRow.SetField(startingIndex++, singleGrade.GradeTypeId);
                    dataRow.SetField(startingIndex++, singleGrade.Comment);
                    dataRow.SetField(startingIndex++, singleGrade.StatusId);
                    dataRow.SetField(startingIndex++, singleGrade.Id);

                    dt.Rows.Add(dataRow);
                }
            }

            return dt;
        }
        private DataTable UpdateUdtModel(List<GradeUpdateRequest> model)
        {
            DataTable dt = new DataTable();

            dt.Columns.Add("FoulId", typeof(int));
            dt.Columns.Add("GradeTypeId", typeof(int));
            dt.Columns.Add("Comment", typeof(string));
            dt.Columns.Add("StatusId", typeof(int));
            dt.Columns.Add("Id", typeof(int));

            if (model != null)
            {
                foreach (GradeUpdateRequest singleGrade in model)
                {
                    DataRow dataRow = dt.NewRow();
                    int startingIndex = 0;

                    dataRow.SetField(startingIndex++, singleGrade.FoulId);
                    dataRow.SetField(startingIndex++, singleGrade.GradeTypeId);
                    dataRow.SetField(startingIndex++, singleGrade.Comment);
                    dataRow.SetField(startingIndex++, singleGrade.StatusId);
                    dataRow.SetField(startingIndex++, singleGrade.Id);

                    dt.Rows.Add(dataRow);
                }
            }

            return dt;
        }
        public void UpdateGrade(GradeUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Grades_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);

                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@StatusId", model.StatusId);
                col.AddWithValue("@Id", model.Id);

            },
            returnParameters: null);
        }
        public void ReplayGradeDeleteById(int id)
        {
            string procName = "[dbo].[ReplayGrades_DeleteById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", id);
            },
               returnParameters: null);
        }
        public void SoftDeleteGrade(int id, int userId)
        {
            string procName = "[dbo].[Grades_Delete]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@ModifiedBy", userId);
                col.AddWithValue("@Id", id);
            },
            returnParameters: null);
        }
        public Paged<Grade> SelectByFoul(int pageIndex, int pageSize, int foulId)
        {
            Paged<Grade> pagedList = null;
            List<Grade> list = null;
            int totalCount = 0;

            string procName = "[dbo].[Grades_Select_ByFoulId]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@PageIndex", pageIndex);
                col.AddWithValue("@PageSize", pageSize);
                col.AddWithValue("@FoulId", foulId);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                Grade grade = new Grade();
                int index = 0;
                grade = MapJoinedGrade(reader, ref index);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(index++);
                }
                
                if (list == null)
                {
                    list = new List<Grade>();
                }
                list.Add(grade);
            });

            if (list != null)
            {
                pagedList = new Paged<Grade>(list, pageIndex, pageSize, totalCount);
            }

            return pagedList;
        }
        public List<GradeType> GetAllGradeTypes(string isReplay)
        {
            string procName = "[dbo].[GradeTypes_Select]";
            List<GradeType> lookUp = null;
              
                _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@IsReplay", isReplay);
                },
                singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int index = 0;
                    GradeType gradeType = MapGradeType(reader, ref index);

                    if (lookUp == null)
                    {
                        lookUp = new List<GradeType>();
                    }
                    lookUp.Add(gradeType);
                });
                return lookUp;
        }
        private GradeType MapGradeType(IDataReader reader, ref int index)
        {
            GradeType type = new GradeType();
            type.Id = reader.GetSafeInt32(index++);
            type.Name = reader.GetSafeString(index++);
            type.Code = reader.GetSafeString(index++);
            type.IsReplay = reader.GetSafeBool(index++);

            return type;
        }
        private Grade MapJoinedGrade(IDataReader reader, ref int index)
        {
            Grade grade = new Grade();
            
            grade.Id = reader.GetSafeInt32(index++);
            grade.FoulId = reader.GetSafeInt32(index++);
            grade.Comment = reader.GetSafeString(index++);
            grade.CreatedBy = _userMapper.MapBaseUser(reader, ref index);
            grade.ModifiedBy = _userMapper.MapBaseUser(reader, ref index);
            grade.DateCreated = reader.GetSafeDateTime(index++);
            grade.DateModified = reader.GetSafeDateTime(index++); 
            grade.StatusType = _lookUpService.MapSingleLookUp(reader, ref index);           
            grade.GradeType = MapGradeType(reader, ref index);

            return grade;
        }
        private static void AddCommonParams(GradeAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@FoulId", model.FoulId);
            col.AddWithValue("@GradeTypeId", model.GradeTypeId);
            col.AddWithValue("@Comment", model.Comment);
        }
    }
}
