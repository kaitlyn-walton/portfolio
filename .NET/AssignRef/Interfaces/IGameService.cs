    public interface IGamesService
    {
        int Add(GameAddRequest model, int userId);
        void Delete(int id, int userId);
        Game GetById(int id);
        List<Game> GetBySeasonId(int seasonId);
        Paged<Game> GetBySeasonIdPaginated(int pageIndex, int pageSize, int id);
        List<Game> GetBySeasonIdAndWeek(int seasonId, int week);
        void Update(GameUpdateRequest model, int userId);
        List<Game> GetBySeasonIdConferenceId(int seasonId, int conferenceId);
    }
