    public interface ICrewService
    {
        int Add(CrewAddRequest model, int userId);
        void Delete(int id);
        void Update(CrewUpdateRequest model, int userId);
        Crew SelectByUserId(int userId);
        Paged<Crew> SelectByPositionId(int pageIndex, int pageSize, string query,int id);
        Paged<Crew> SelectByConferenceId(int pageIndex, int pageSize, int id);
        Paged<Crew> CrewSelectAll(int pageIndex, int pageSize);
        Paged<Crew> CrewSearch(int pageIndex, int pageSize, string query);
        List<LookUp3Col> SelectByCrewNumber(int crewNumber, string replayOfficials, string alternateOfficial);
    }
