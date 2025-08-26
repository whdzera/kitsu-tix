module Organizer
  class DashboardController < ApplicationController
    before_action :authenticate_user!
    before_action :require_organizer

    def index
      @user = current_user
    end

    private

    def require_organizer
      unless current_user.organizer?
        flash[:alert] = "You need to be an organizer to access this area."
        redirect_to root_path
      end
    end
  end
end
