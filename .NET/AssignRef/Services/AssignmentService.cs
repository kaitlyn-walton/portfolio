using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Requests.Assignments;
using System;
using System.Data;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using Sabio.Services.Interfaces;
using Stripe.Terminal;

namespace Sabio.Services
{
    public class AssignmentService : IAssignmentService
    {
        IDataProvider _data = null;
        IBaseUserMapper _userMapper = null;
        IMapGame _gameMapper = null;

        public AssignmentService(IDataProvider data, IBaseUserMapper userMapper, IMapGame gameMapper)
        {
            _data = data;
            _userMapper = userMapper;
            _gameMapper = gameMapper;
        }

        public void Update(AssignmentUpdateRequest model, int userId)
        {
            string procName = "[dbo].[Assignments_Update]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@Id", model.Id);
                    col.AddWithValue("@ModifiedBy", userId);
                },
                returnParameters: null);
        }

        public int Add(AssignmentAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Assignments_Insert]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    AddCommonParams(model, col);
                    col.AddWithValue("@CreatedBy", userId);
                    col.AddWithValue("@ModifiedBy", userId);

                    SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                    idOut.Direction = ParameterDirection.Output;

                    col.Add(idOut);

                },
                returnParameters: delegate (SqlParameterCollection returnCol)
                {
                    object objtId = returnCol["@Id"].Value;

                    int.TryParse(objtId.ToString(), out id);
                });

            return id;
        }

        public int AddWithPositions(AssignmentPositionAddRequest model, int userId)
        {
            string procName = "[dbo].[Assignments_InsertPositions]";
            DataTable dataTable = InsertPositionsModel(model.OfficialData);
            int id = new int();

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@GameId", model.GameId);
                col.AddWithValue("@AssignmentTypeId", model.AssignmentTypeId);
                col.AddWithValue("@BatchInsertPositions", dataTable);
                col.AddWithValue("@Fee", model.Fee);
                col.AddWithValue("@CreatedBy", userId);
                col.AddWithValue("@ModifiedBy", userId);

            }, singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int index = 0;
                id = reader.GetSafeInt32(index++);
            });
            return id;
        }

        private DataTable InsertPositionsModel(List<OfficialPositionAddRequest> positions)
        {
            DataTable result = new DataTable();

            result.Columns.Add("PositionId", typeof(int));
            result.Columns.Add("UserId", typeof(int));
            result.Columns.Add("AssignmentStatusId", typeof (int));

            if(positions != null)
            {
                foreach(OfficialPositionAddRequest aPosition in positions)
                {
                    DataRow dataRow = result.NewRow();
                    int startingIndex = 0;

                    dataRow.SetField(startingIndex++, aPosition.PositionId);
                    dataRow.SetField(startingIndex++, aPosition.UserId);
                    dataRow.SetField(startingIndex++, aPosition.AssignmentStatusId);

                    result.Rows.Add(dataRow);
                }
            }
            return result;
        }

        public GameAssignments Get(int id)
        {
            string procName = "[dbo].[Assignments_Select_ByGameId_Details]";
            GameAssignments assignment = null;

            _data.ExecuteCmd(procName, delegate (SqlParameterCollection paramCol)
            {

                paramCol.AddWithValue("@GameId", id);
            }, delegate (IDataReader reader, short set)
            {
                assignment = MapSingleAssignment(reader);
            });
            return assignment;
        }

        public void Delete(int id)
        {
            string procName = "[dbo].[Assignments_DeleteById]";
            _data.ExecuteNonQuery(procName,
                inputParamMapper: delegate (SqlParameterCollection col)
                {
                    col.AddWithValue("@Id", id);
                }, returnParameters: null
                );
        }

        private static void AddCommonParams(AssignmentAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@GameId", model.GameId);
            col.AddWithValue("@AssignmentTypeId", model.AssignmentTypeId);
            col.AddWithValue("@PositionId", model.PositionId);
            col.AddWithValue("@UserId", model.UserId);
            col.AddWithValue("@Fee", model.Fee);
            col.AddWithValue("@AssignmentStatusId", model.AssignmentStatusId);

        }

        private GameAssignments MapSingleAssignment(IDataReader reader)
        {
            GameAssignments assignment = new GameAssignments();
            int strtIndx = 0;
            assignment.Game = _gameMapper.MapSingleGame(reader, ref strtIndx);
            assignment.Assignments = reader.DeserializeObject<List<Assignment>>(strtIndx);
            return assignment;
        }
    }
}
